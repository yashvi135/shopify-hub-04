const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const Category = require('../models/Category');
const upload = require('../middleware/upload');
const syncService = require('../utils/syncService');


// @desc    Create new product
// @route   POST /api/products
// @access  Public
// Use upload.any() to handle dynamic keys from FormData like "variantImage_Red", "baseImage", etc.
router.post('/', upload.any(), async (req, res) => {
  try {
    // Parse the JSON stringified textual data sent from the frontend
    const reqData = req.body;
    let newProductData = {
      title: reqData.title,
      description: reqData.description,
      category: reqData.categoryId,
      subcategory: reqData.subcategoryId,
      storeId: reqData.storeId,
      pricing: {
        purchasePrice: Number(reqData.purchasePrice),
        mrp: Number(reqData.mrp),
        sellingPrice: Number(reqData.sellingPrice),
        discountPercentage: Number(reqData.discountPercentage || 0)
      },
      inventory: {
        stockQuantity: Number(reqData.stockQuantity)
      },
      variants: {
        sizes: reqData.sizes ? JSON.parse(reqData.sizes) : [],
        colors: reqData.colors ? JSON.parse(reqData.colors) : []
      },
      variantImages: [],
      baseImages: []
    };

    // If there are files uploaded via Cloudinary, categorize them
    if (req.files && req.files.length > 0) {
      
      // We expect the frontend to name form inputs like: 
      // name="variantImage_Red"
      // name="variantImage_Blue"
      // name="baseImage"
      
      const variantMap = {};
      
      req.files.forEach(file => {
        if (file.fieldname.startsWith('variantImage_')) {
          const colorName = file.fieldname.split('_')[1];
          if (!variantMap[colorName]) {
            variantMap[colorName] = [];
          }
          variantMap[colorName].push(file.path);
        } else if (file.fieldname === 'baseImage') {
          newProductData.baseImages.push(file.path);
        }
      });

      // Convert variantMap dictionary into the Mongoose array schema format
      for (const [color, urls] of Object.entries(variantMap)) {
        newProductData.variantImages.push({
          color: color,
          urls: urls
        });
      }
    }

    const product = await Product.create(newProductData);

    // Sync to Buyer App
    syncService.syncProduct(product);

    res.status(201).json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message, stack: error.stack });
  }
});

// @desc    Bulk publish/unpublish products
// @route   PUT /api/products/bulk-publish
// @access  Public
router.put('/bulk-publish', async (req, res) => {
  try {
    const { ids, isActive } = req.body;
    if (!ids || !Array.isArray(ids)) {
      return res.status(400).json({ success: false, message: 'Array of product IDs is required' });
    }

    // Update in database
    await Product.updateMany({ _id: { $in: ids } }, { isActive });

    // Fetch updated products to sync to buyer app
    const updatedProducts = await Product.find({ _id: { $in: ids } }).populate('category');
    
    // Sync to Buyer App
    await syncService.syncMultipleProducts(updatedProducts);

    res.status(200).json({ success: true, message: `Successfully updated ${ids.length} products` });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Public
router.put('/:id', upload.any(), async (req, res) => {
  try {
    let product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const reqData = req.body;
    let upProductData = {
      title: reqData.title || product.title,
      description: reqData.description || product.description,
      category: reqData.categoryId || product.category,
      subcategory: reqData.subcategoryId || product.subcategory,
      pricing: {
        purchasePrice: reqData.purchasePrice ? Number(reqData.purchasePrice) : product.pricing.purchasePrice,
        mrp: reqData.mrp ? Number(reqData.mrp) : product.pricing.mrp,
        sellingPrice: reqData.sellingPrice ? Number(reqData.sellingPrice) : product.pricing.sellingPrice,
        discountPercentage: reqData.discountPercentage ? Number(reqData.discountPercentage) : product.pricing.discountPercentage
      },
      inventory: {
        stockQuantity: reqData.stockQuantity ? Number(reqData.stockQuantity) : product.inventory.stockQuantity
      },
      variants: {
        sizes: reqData.sizes ? JSON.parse(reqData.sizes) : product.variants.sizes,
        colors: reqData.colors ? JSON.parse(reqData.colors) : product.variants.colors
      }
    };

    // If there are files uploaded via Cloudinary, categorize them
    if (req.files && req.files.length > 0) {
      const variantMap = {};
      let baseImages = [];
      
      req.files.forEach(file => {
        if (file.fieldname.startsWith('variantImage_')) {
          const colorName = file.fieldname.split('_')[1];
          if (!variantMap[colorName]) variantMap[colorName] = [];
          variantMap[colorName].push(file.path);
        } else if (file.fieldname === 'baseImage') {
          baseImages.push(file.path);
        }
      });

      // Simple implementation: Just replace existing variantImages with the newly uploaded ones 
      // (a robust implementation would merge or delete specific URLs)
      let finalVariantImages = [];
      for (const [color, urls] of Object.entries(variantMap)) {
        finalVariantImages.push({ color, urls });
      }
      
      if (finalVariantImages.length > 0) upProductData.variantImages = finalVariantImages;
      if (baseImages.length > 0) upProductData.baseImages = baseImages;
    }

    product = await Product.findByIdAndUpdate(req.params.id, upProductData, { new: true, runValidators: true });
    
    // Sync to Buyer App
    syncService.syncProduct(product);

    res.status(200).json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Get all products (filtered by storeId) with pagination
// @route   GET /api/products?storeId=STORE_xxx&page=1&limit=20&search=keyword
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { storeId, page = 1, limit = 20, search } = req.query;

    // Build query
    const query = storeId ? { storeId } : {};

    // Optional search by title
    if (search && search.trim()) {
      query.title = { $regex: search.trim(), $options: 'i' };
    }

    const pageNum  = Math.max(1, parseInt(page, 10));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10))); // cap at 100
    const skip     = (pageNum - 1) * limitNum;

    const [products, total] = await Promise.all([
      Product.find(query)
        .populate('category', 'name')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .lean(), // lean() returns plain JS objects — faster than Mongoose documents
      Product.countDocuments(query),
    ]);

    res.status(200).json({
      success: true,
      count: products.length,
      total,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum),
      data: products,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('category', 'name');
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.status(200).json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Public
router.delete('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    await product.deleteOne();

    // Notify Buyer App (Optional, if endpoint exists)
    syncService.deleteProduct(product._id);

    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Toggle product publish status and sync to buyer app
// @route   PUT /api/products/:id/publish
// @access  Public
// @desc    Toggle product publish status and sync to buyer app
// @route   PUT /api/products/:id/publish
// @access  Public
router.put('/:id/publish', async (req, res) => {
  try {
    const { isActive } = req.body;
    let product = await Product.findById(req.params.id).populate('category');
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    product.isActive = isActive;
    await product.save();

    // Sync to Buyer App (wait for it or at least catch potential sync errors)
    await syncService.syncProduct(product);

    res.status(200).json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
