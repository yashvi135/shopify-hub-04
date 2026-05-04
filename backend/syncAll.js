const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');
const Category = require('./models/Category');
const syncService = require('./utils/syncService');

dotenv.config();

const syncAll = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB Connected...');

    const categories = await Category.find();
    console.log(`Syncing ${categories.length} categories...`);
    for (const cat of categories) {
      await syncService.syncCategory(cat);
    }

    const products = await Product.find().populate('category');
    console.log(`Syncing ${products.length} products...`);
    await syncService.syncMultipleProducts(products);

    console.log('🎉 All products and categories synced to Buyer App!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Sync error:', error.message);
    process.exit(1);
  }
};

syncAll();
