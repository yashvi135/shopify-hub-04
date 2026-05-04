const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');
const Category = require('./models/Category');
const User = require('./models/User');

// Load env variables
dotenv.config();

// Sample Cloudinary images already in your DB
const SAMPLE_IMAGES = [
  'https://res.cloudinary.com/dfmhweist/image/upload/v1775152946/surat-garment-logos/sgldvhl44uajc3tlldt8.avif',
  'https://res.cloudinary.com/dfmhweist/image/upload/v1775152999/surat-garment-logos/r7x1omj3qrutavfy5knj.jpg',
  'https://res.cloudinary.com/dfmhweist/image/upload/v1775153098/surat-garment-logos/qpcwobpx53cyc5mydght.jpg',
  'https://res.cloudinary.com/dfmhweist/image/upload/v1775153328/surat-garment-logos/ft0syffuumptgpqs288r.jpg',
  'https://res.cloudinary.com/dfmhweist/image/upload/v1775153351/surat-garment-logos/neak47nyptadedkuogk0.webp',
  'https://res.cloudinary.com/dfmhweist/image/upload/v1775153555/surat-garment-logos/czeaulnpbkagfwurhxmc.avif',
  'https://res.cloudinary.com/dfmhweist/image/upload/v1775153575/surat-garment-logos/f7avz6xhagwhoejfszkw.avif'
];

const COLORS = ['Red', 'Blue', 'Black', 'White', 'Pink', 'Yellow', 'Navy'];
const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
const ADJECTIVES = ['Premium', 'Elegant', 'Casual', 'Classic', 'Stylish', 'Comfortable', 'Modern', 'Chic', 'Trendy', 'Luxe'];

const randItem = (arr) => arr[Math.floor(Math.random() * arr.length)];
const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const seedProducts = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB Connected...');

    // ── Step 1: Get storeId from the first registered user ──
    const user = await User.findOne({}).select('storeId email storeName');
    if (!user || !user.storeId) {
      console.log('❌ Error: No registered user with a storeId found.');
      console.log('   Please register/login in the admin panel first.');
      process.exit(1);
    }
    console.log(`✅ Using storeId: "${user.storeId}" (${user.email})`);

    // ── Step 2: Get real categories from DB ──
    const categories = await Category.find();
    if (categories.length === 0) {
      console.log('❌ Error: No categories found. Please create categories first.');
      process.exit(1);
    }
    console.log(`✅ Found ${categories.length} categories.`);

    // ── Step 3: Delete old seeded products for this store (clean slate) ──
    const deleted = await Product.deleteMany({ storeId: user.storeId });
    console.log(`🗑️  Cleared ${deleted.deletedCount} existing products for this store.`);

    // ── Step 4: Build 50 products ──
    const products = [];

    for (let i = 1; i <= 50; i++) {
      const randomCategory = randItem(categories);

      // Pick a real subcategory name, or fallback to 'General'
      let subcategoryName = 'General';
      if (randomCategory.subcategories && randomCategory.subcategories.length > 0) {
        subcategoryName = randItem(randomCategory.subcategories).name;
      }

      // Pricing
      const purchasePrice = randInt(300, 800);
      const sellingPrice  = purchasePrice + randInt(150, 500);
      const mrp           = sellingPrice + randInt(100, 400);
      const discountPercentage = Math.round(((mrp - sellingPrice) / mrp) * 100);

      // Variants
      const numColors = randInt(1, 3);
      const selectedColors = [...new Set(Array.from({ length: numColors }, () => randItem(COLORS)))];
      const selectedSizes  = [...new Set(Array.from({ length: randInt(2, 4) }, () => randItem(SIZES)))];

      // Variant images — each color gets 1-2 images
      const variantImages = selectedColors.map(color => ({
        color,
        urls: Array.from(
          { length: Math.random() > 0.4 ? 2 : 1 },
          () => randItem(SAMPLE_IMAGES)
        )
      }));

      products.push({
        title: `${randItem(ADJECTIVES)} ${subcategoryName} ${i}`,
        description: `High-quality ${randomCategory.name} product. Perfect for everyday styling. Premium fabric and comfortable fit — a must-have in your ${subcategoryName} collection.`,
        category: randomCategory._id,
        subcategory: subcategoryName,
        pricing: { purchasePrice, mrp, sellingPrice, discountPercentage },
        inventory: { stockQuantity: randInt(10, 120) },
        variants: { sizes: selectedSizes, colors: selectedColors },
        variantImages,
        storeId: user.storeId,  // ✅ Real storeId from DB
        isActive: true
      });
    }

    // ── Step 5: Insert into DB ──
    await Product.insertMany(products);
    console.log(`\n🎉 Success! Inserted 50 products for store "${user.storeName || user.email}" (storeId: ${user.storeId})`);
    console.log('   Refresh your admin panel → Products page to see them.\n');
    process.exit(0);

  } catch (error) {
    console.error('❌ Seed error:', error.message);
    process.exit(1);
  }
};

seedProducts();
