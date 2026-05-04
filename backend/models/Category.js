const mongoose = require('mongoose');

const SubcategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a subcategory name'],
    trim: true
  },
  image: {
    type: String,
    trim: true
  }
});

const CategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a category name'],
    unique: true,
    trim: true,
    maxlength: [50, 'Name can not be more than 50 characters']
  },
  image: {
    type: String,
    trim: true
  },
  subcategories: [SubcategorySchema],
  isActive: {
    type: Boolean,
    default: true
  },
  slug: {
    type: String,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  displayOrder: {
    type: Number,
    default: 0,
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Category', CategorySchema);
