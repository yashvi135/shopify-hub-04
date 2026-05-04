const mongoose = require('mongoose');

// Section types: what the section represents conceptually
const SECTION_TYPES = [
  'SEARCH_BANNER',       // Fixed first section — search bar + banner carousel
  'CATEGORY_GRID',       // Fixed last section — grid of categories
  'BEST_OFFERS',         // Auto-pulls discounted/sale products
  'NEW_ARRIVALS',        // Auto-pulls recently added products
  'TOP_PICKS',           // Manually curated featured products
  'PROMOTIONAL_BANNER',  // A standalone promotional banner strip
];

// Template types: how the section looks visually
const TEMPLATE_TYPES = [
  'SEARCH_GRID',         // Search bar on top, banner carousel below
  'PRODUCT_GRID',        // Standard horizontal product scroll
  'PRODUCT_3X2',         // 3-column, 2-row product grid
  'PROMOTIONAL_BANNER',  // Full-width single promotional banner
  'CATEGORY_GRID',       // Grid of category icons/images
];

const homePageSectionSchema = new mongoose.Schema({
  storeId: {
    type: String,
    required: [true, 'Store ID is required'],
    index: true,
  },
  sectionType: {
    type: String,
    required: [true, 'Section type is required'],
    enum: {
      values: SECTION_TYPES,
      message: `Section type must be one of: ${SECTION_TYPES.join(', ')}`,
    },
  },
  templateType: {
    type: String,
    required: [true, 'Template type is required'],
    enum: {
      values: TEMPLATE_TYPES,
      message: `Template type must be one of: ${TEMPLATE_TYPES.join(', ')}`,
    },
  },
  title: {
    type: String,
    trim: true,
    maxlength: [200, 'Title must not exceed 200 characters'],
  },
  displayOrder: {
    type: Number,
    required: [true, 'Display order is required'],
    min: [1, 'Display order must be at least 1'],
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  isLocked: {
    type: Boolean,
    default: false, // locked = cannot be deleted or moved (used for SEARCH_BANNER and CATEGORY_GRID)
  },
  // Config for section-specific data (e.g. manually curated product IDs for TOP_PICKS)
  config: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
  },
}, { timestamps: true });

homePageSectionSchema.index({ storeId: 1, displayOrder: 1 });

module.exports = mongoose.model('HomePageSection', homePageSectionSchema);
module.exports.SECTION_TYPES = SECTION_TYPES;
module.exports.TEMPLATE_TYPES = TEMPLATE_TYPES;
