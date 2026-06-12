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

const COLORS = ['Red', 'Blue', 'Green', 'Yellow', 'Pink', 'Maroon', 'Gold', 'Purple', 'Orange', 'Magenta'];
const SIZES = ['Free Size'];
const ADJECTIVES = ['Pure', 'Elegant', 'Bridal', 'Classic', 'Traditional', 'Designer', 'Handwoven', 'Party Wear', 'Festive', 'Luxe'];

const randItem = (arr) => arr[Math.floor(Math.random() * arr.length)];
const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB Connected...');

    // ── Step 1: Get storeId from the first registered user, or create one ──
    let user = await User.findOne({}).select('storeId email storeName');
    if (!user || !user.storeId) {
      console.log('⚠️ No registered user found. Creating a default admin user...');
      user = await User.create({
        email: 'admin@suratgarment.com',
        password: 'password123',
        storeName: 'Surat Garment Admin',
        storeId: 'STORE_DEFAULT_001',
        isProfileComplete: true
      });
    }
    console.log(`✅ Using storeId: "${user.storeId}" (${user.email})`);

    // ── Step 2: Clear old categories and products ──
    await Category.deleteMany({});
    console.log('🗑️  Cleared existing categories.');
    await Product.deleteMany({ storeId: user.storeId });
    console.log('🗑️  Cleared existing products.');

    // ── Step 3: Insert Categories ──
    const categoryData = [
      {
        name: 'Silk Sarees',
        slug: 'silk-sarees',
        description: 'Premium traditional and bridal silk sarees',
        image: SAMPLE_IMAGES[0],
        subcategories: [{ name: 'Banarasi' }, { name: 'Kanjivaram' }, { name: 'Art Silk' }, { name: 'Paithani' }]
      },
      {
        name: 'Cotton Sarees',
        slug: 'cotton-sarees',
        description: 'Comfortable and breathable daily wear cotton sarees',
        image: SAMPLE_IMAGES[1],
        subcategories: [{ name: 'Pure Cotton' }, { name: 'Chanderi' }, { name: 'Linen' }, { name: 'Kota Doria' }]
      },
      {
        name: 'Designer Sarees',
        slug: 'designer-sarees',
        description: 'Exclusive designer sarees for parties and special occasions',
        image: SAMPLE_IMAGES[2],
        subcategories: [{ name: 'Party Wear' }, { name: 'Embroidered' }, { name: 'Georgette' }, { name: 'Chiffon' }]
      }
    ];

    const insertedCategories = await Category.insertMany(categoryData);
    console.log(`✅ Inserted ${insertedCategories.length} categories.`);

    // ── Step 4: Build 50 products ──
    const products = [];

    for (let i = 1; i <= 50; i++) {
      const randomCategory = randItem(insertedCategories);

      // Pick a real subcategory name
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
      
      const genderMap = {
        'Silk Sarees': 'women',
        'Cotton Sarees': 'women',
        'Designer Sarees': 'women'
      };

      products.push({
        title: `${randItem(ADJECTIVES)} ${subcategoryName} ${i}`,
        description: `High-quality ${randomCategory.name} product. Perfect for everyday styling. Premium fabric and comfortable fit — a must-have in your ${subcategoryName} collection.`,
        category: randomCategory._id,
        subcategory: subcategoryName,
        pricing: { purchasePrice, mrp, sellingPrice, discountPercentage },
        inventory: { stockQuantity: randInt(10, 120) },
        variants: { sizes: selectedSizes, colors: selectedColors },
        variantImages,
        baseImages: [randItem(SAMPLE_IMAGES)],
        storeId: user.storeId,  // ✅ Real storeId from DB
        isActive: true,
        genderFilter: genderMap[randomCategory.name] || 'all',
        isTopSelling: Math.random() > 0.7
      });
    }

    // ── Step 5: Insert into DB ──
    await Product.insertMany(products);
    console.log(`\n🎉 Success! Inserted 50 products and categories for store "${user.storeName || user.email}"`);
    console.log('   Refresh your admin panel → Products page to see them.\n');
    process.exit(0);

  } catch (error) {
    console.error('❌ Seed error:', error.message);
    process.exit(1);
  }
};

seedDatabase();
