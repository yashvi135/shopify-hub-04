const mongoose = require('mongoose');

/**
 * Banner positions:
 *   BACKGROUND — sits behind search bar. Accepts video OR multiple images.
 *   FRONTEND   — foreground carousel banners. Accepts a background image + multiple slide images. No video.
 *
 * bannerType (section):
 *   SEARCH       — used in the Search & Banner section of home page
 *   PROMOTIONAL  — used in Promotional Banner sections of home page
 */

const BannerSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Banner title is required'],
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },

  // Which section this banner belongs to
  bannerType: {
    type: String,
    enum: ['SEARCH', 'PROMOTIONAL'],
    default: 'PROMOTIONAL',
  },

  // Position within the section
  position: {
    type: String,
    enum: ['BACKGROUND', 'FRONTEND'],
    default: 'FRONTEND',
  },

  // For BACKGROUND position: 'VIDEO' or 'IMAGES'
  // For FRONTEND position: always 'IMAGES' (no video)
  mediaType: {
    type: String,
    enum: ['VIDEO', 'IMAGES'],
    default: 'IMAGES',
  },

  // Single video URL — only when position=BACKGROUND and mediaType=VIDEO
  videoUrl: {
    type: String,
  },

  // Multiple image URLs — used in:
  //   position=BACKGROUND + mediaType=IMAGES: background slideshow images
  //   position=FRONTEND: the carousel slide images shown to buyers
  mediaImages: {
    type: [String],
    default: [],
  },

  // Static backdrop image — only for position=FRONTEND
  // (the image behind the carousel banners)
  backgroundImage: {
    type: String,
  },

  // Link behavior for FRONTEND carousel banners
  link: { type: String },
  linkType: {
    type: String,
    enum: ['category', 'product', 'external', 'none'],
    default: 'none',
  },
  linkId: { type: String },

  displayOrder: {
    type: Number,
    default: 0,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  startDate: { type: Date },
  endDate: { type: Date },

  storeId: {
    type: String,
    index: true,
  },
}, { timestamps: true });

BannerSchema.index({ storeId: 1, bannerType: 1, position: 1 });

module.exports = mongoose.model('Banner', BannerSchema);
