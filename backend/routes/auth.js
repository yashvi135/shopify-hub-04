const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const upload = require('../middleware/upload');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

// @desc    Register user (Initial step just password setup, or full setup)
// @route   POST /api/auth/register
// @access  Public
router.post('/register', upload.single('storeLogo'), async (req, res) => {
  try {
    const { 
      email, password, storeName, gstNumber, contactNumber,
      shippingCharges, shippingDays, paymentMethod
    } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    const user = await User.create({
      email,
      password,
      storeName,
      storeLogo: req.file ? req.file.path : undefined,
      gstNumber,
      contactNumber,
      shippingCharges,
      shippingDays,
      paymentMethod,
      isProfileComplete: true
    });

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        email: user.email,
        storeName: user.storeName,
        storeLogo: user.storeLogo,
        gstNumber: user.gstNumber,
        contactNumber: user.contactNumber,
        shippingCharges: user.shippingCharges,
        shippingDays: user.shippingDays,
        paymentMethod: user.paymentMethod,
        isProfileComplete: user.isProfileComplete
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check for user
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({ success: false, message: 'Email does not exist' });
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        email: user.email,
        storeName: user.storeName,
        storeLogo: user.storeLogo,
        gstNumber: user.gstNumber,
        contactNumber: user.contactNumber,
        shippingCharges: user.shippingCharges,
        shippingDays: user.shippingDays,
        paymentMethod: user.paymentMethod,
        isProfileComplete: user.isProfileComplete
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Forgot password
// @route   POST /api/auth/forgotpassword
// @access  Public
router.post('/forgotpassword', async (req, res) => {
  const { email } = req.body;
  
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: 'There is no user with that email' });
    }

    // Generate 6 digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Hash OTP before saving (for security like password)
    const salt = await require('bcryptjs').genSalt(10);
    user.resetPasswordOtp = await require('bcryptjs').hash(otp, salt);
    // Expire in 10 minutes
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000;
    
    await user.save();

    // Send email
    const sendEmail = require('../utils/sendEmail');
    const message = `
      <h1>Password Reset Request</h1>
      <p>You requested a password reset for your Surat Garment Admin Panel.</p>
      <p>Your OTP is: <strong>${otp}</strong></p>
      <p>This OTP will expire in 10 minutes.</p>
    `;

    try {
      await sendEmail({
        email: user.email,
        subject: 'Password Reset OTP',
        message
      });
      res.status(200).json({ success: true, message: 'OTP sent to email' });
    } catch (err) {
      user.resetPasswordOtp = undefined;
      user.resetPasswordExpire = undefined;
      await user.save({ validateBeforeSave: false });
      return res.status(500).json({ success: false, message: 'Email could not be sent' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Reset password
// @route   PUT /api/auth/resetpassword
// @access  Public
router.put('/resetpassword', async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    
    const user = await User.findOne({ 
      email,
      resetPasswordExpire: { $gt: Date.now() } 
    });

    if (!user || (!user.resetPasswordOtp)) {
      return res.status(400).json({ success: false, message: 'Invalid or expired OTP' });
    }

    // Check OTP
    const isMatch = await require('bcryptjs').compare(otp, user.resetPasswordOtp);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Invalid OTP' });
    }

    // Set new password, pre-save hook will hash it
    user.password = newPassword;
    user.resetPasswordOtp = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    res.status(200).json({ success: true, message: 'Password reset successful' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Update store logo
// @route   PUT /api/auth/profile/logo
// @access  Public (for now)
router.put('/profile/logo', upload.single('storeLogo'), async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please upload a valid image file' });
    }

    const user = await User.findOneAndUpdate(
      { email },
      { storeLogo: req.file.path },
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Logo updated successfully',
      storeLogo: user.storeLogo
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
