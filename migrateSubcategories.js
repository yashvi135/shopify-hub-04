const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load env vars
dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/suratgarment';

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(async () => {
  console.log('MongoDB Connected correctly.');
  
  // Get direct access to the collection without Mongoose schema constraints
  const db = mongoose.connection.db;
  const categoriesCollection = db.collection('categories');
  
  const categories = await categoriesCollection.find({}).toArray();
  
  let modifiedCount = 0;
  for (let cat of categories) {
    let needsUpdate = false;
    let mappedSubcategories = [];
    
    if (cat.subcategories && Array.isArray(cat.subcategories)) {
      mappedSubcategories = cat.subcategories.map(sub => {
        if (typeof sub === 'string') {
          needsUpdate = true;
          // give it an object structure
          return {
            _id: new mongoose.Types.ObjectId(),
            name: sub,
            image: null
          };
        }
        return sub; // already an object
      });
    }

    if (needsUpdate) {
      await categoriesCollection.updateOne(
        { _id: cat._id },
        { $set: { subcategories: mappedSubcategories } }
      );
      modifiedCount++;
      console.log(`Migrated subcategories for category: ${cat.name}`);
    }
  }

  console.log(`Migration complete. Updated ${modifiedCount} categories.`);
  process.exit();

}).catch(err => {
  console.error(err);
  process.exit(1);
});
