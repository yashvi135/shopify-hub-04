const express = require('express');
const router = express.Router();
const Category = require('../models/Category');
const upload = require('../middleware/upload');
const axios = require('axios');

const BUYER_APP_URL = process.env.BUYER_APP_URL || 'http://localhost:3000';

// ─── Helper: push one category to buyer app ──────────────────────────────────
async function syncCategoryToBuyerApp(category) {
  try {
    await axios.post(`${BUYER_APP_URL}/api/sync/category`, {
      adminCategoryId: category._id.toString(),
      name:            category.name,
      description:     category.description,
      image:           category.image,
      isActive:        category.isActive,
      subcategories:   category.subcategories,
    });
  } catch (err) {
    console.error('[Sync] Failed to sync category to buyer app:', err.message);
  }
}

// ─── Helper: delete one category from buyer app ──────────────────────────────
async function deleteCategoryFromBuyerApp(categoryId) {
  try {
    await axios.delete(`${BUYER_APP_URL}/api/sync/category/${categoryId}`);
  } catch (err) {
    console.error('[Sync] Failed to delete category from buyer app:', err.message);
  }
}

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public (should be protected in prod)
router.get('/', async (req, res) => {
  try {
    const categories = await Category.find({ isActive: true });
    res.status(200).json({ success: true, count: categories.length, data: categories });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Create new category
// @route   POST /api/categories
// @access  Public (should be protected in prod)
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const categoryData = { ...req.body };
    if (req.file) {
      categoryData.image = req.file.path; // Cloudinary URL
    }
    // Handle subcategories if sent as JSON string
    if (categoryData.subcategories && typeof categoryData.subcategories === 'string') {
      try {
        categoryData.subcategories = JSON.parse(categoryData.subcategories);
      } catch (e) {
        return res.status(400).json({ success: false, message: 'Invalid subcategories format' });
      }
    }
    
    const category = await Category.create(categoryData);

    // Sync to buyer app
    syncCategoryToBuyerApp(category);

    res.status(201).json({ success: true, data: category });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: 'Category name already exists' });
    }
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Update category (name, image)
// @route   PUT /api/categories/:id
// @access  Public (should be protected in prod)
router.put('/:id', upload.single('image'), async (req, res) => {
  try {
    const updateData = { ...req.body };
    if (req.file) {
      updateData.image = req.file.path;
    }
    // Note: if doing regular update with old array format, handle it gracefully
    if (updateData.subcategories && typeof updateData.subcategories === 'string') {
       // if from old direct submit logic without special endpoint
       try {
         updateData.subcategories = JSON.parse(updateData.subcategories);
       } catch (e) {}
    } else if (Array.isArray(updateData.subcategories) && updateData.subcategories.length > 0 && typeof updateData.subcategories[0] === 'string') {
      // mapping legacy string subcategories to objects for backward compat during migration/updates temporarily
      updateData.subcategories = updateData.subcategories.map(name => ({ name }));
    }

    const category = await Category.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true
    });
    
    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    // Sync to buyer app
    syncCategoryToBuyerApp(category);

    res.status(200).json({ success: true, data: category });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Add a subcategory specifically with image
// @route   POST /api/categories/:id/subcategories
// @access  Public (should be protected in prod)
router.post('/:id/subcategories', upload.single('image'), async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
       return res.status(404).json({ success: false, message: 'Category not found' });
    }
    
    const subcategory = {
      name: req.body.name,
    };
    if (req.file) {
      subcategory.image = req.file.path;
    }
    
    category.subcategories.push(subcategory);
    await category.save();
    
    // Sync to buyer app
    syncCategoryToBuyerApp(category);

    res.status(200).json({ success: true, data: category });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Remove a subcategory by ID or Name
// @route   DELETE /api/categories/:id/subcategories/:subId
// @access  Public (should be protected in prod)
router.delete('/:id/subcategories/:subId', async (req, res) => {
  try {
     const category = await Category.findById(req.params.id);
     if (!category) {
        return res.status(404).json({ success: false, message: 'Category not found' });
     }
     
     // try removing by ObjectId, or fallback to name for backward compatibility
     category.subcategories = category.subcategories.filter(sub => {
        return sub._id.toString() !== req.params.subId && sub.name !== req.params.subId;
     });
     
     await category.save();
     
     // Sync to buyer app
     syncCategoryToBuyerApp(category);

     res.status(200).json({ success: true, data: category });
  } catch(error) {
     res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Delete category
// @route   DELETE /api/categories/:id
// @access  Public (should be protected in prod)
router.delete('/:id', async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }
    const adminCategoryId = category._id.toString();
    await category.deleteOne();

    // Sync to buyer app
    deleteCategoryFromBuyerApp(adminCategoryId);

    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
