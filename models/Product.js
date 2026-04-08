const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a product title'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please add a description'],
    maxlength: [1000, 'Description cannot be more than 1000 characters']
  },
  category: {
    type: mongoose.Schema.ObjectId,
    ref: 'Category',
    required: true
  },
  subcategory: {
    type: String,
    required: true
  },
  pricing: {
    purchasePrice: {
      type: Number,
      required: true
    },
    mrp: {
      type: Number,
      required: true
    },
    sellingPrice: {
      type: Number,
      required: true
    },
    discountPercentage: {
      type: Number,
      default: 0
    }
  },
  inventory: {
    stockQuantity: {
      type: Number,
      required: true,
      min: 0
    }
  },
  variants: {
    sizes: [{
      type: String,
      enum: ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL', 'Free Size'],
    }],
    colors: [{
      type: String
    }]
  },
  // Maps a specific color to an array of Cloudinary Image URLs
  variantImages: [{
    color: {
      type: String,
      required: true
    },
    urls: [{
      type: String,
      required: true
    }]
  }],
  // For products that don't have color variants
  baseImages: [{
    type: String
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  storeId: {
    type: String,
    required: [true, 'Product must belong to a store'],
    index: true,
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Product', ProductSchema);
