const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;
require('dotenv').config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ─── Existing: Logo / product image uploader (images only, 5MB) ─────────────
const logoStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'surat-garment-logos',
    allowed_formats: ['jpg', 'png', 'jpeg', 'webp', 'avif', 'gif'],
    transformation: [
      { width: 800, height: 800, crop: 'limit' },
      { quality: 'auto', fetch_format: 'auto' }, // Auto WebP/AVIF + smart compression
    ],
  },
});
const upload = multer({ storage: logoStorage, limits: { fileSize: 5 * 1024 * 1024 } });

// ─── Banner images uploader (images only, 10MB each) ─────────────────────────
const bannerImageStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'surat-garment-banners',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'avif'],
    transformation: [{ quality: 'auto', fetch_format: 'auto' }],
  },
});
const uploadBannerImages = multer({
  storage: bannerImageStorage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Only image files are allowed for this field.'));
    }
    cb(null, true);
  },
});

// ─── Banner video uploader (video only, 50MB) ─────────────────────────────────
const bannerVideoStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'surat-garment-banner-videos',
    resource_type: 'video',
    allowed_formats: ['mp4', 'webm', 'mov'],
  },
});
const uploadBannerVideo = multer({
  storage: bannerVideoStorage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith('video/')) {
      return cb(new Error('Only video files are allowed for background video.'));
    }
    cb(null, true);
  },
});

module.exports = upload;
module.exports.uploadBannerImages = uploadBannerImages;
module.exports.uploadBannerVideo = uploadBannerVideo;
