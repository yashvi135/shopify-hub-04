const mongoose = require('mongoose');

// Assuming you want to migrate 'buyer-app' from Atlas to local 'buyer-app' database
const sourceURI = 'mongodb+srv://yasoni715_db_user:o8h4BdiuIakksUHz@cluster0.6m7z1tp.mongodb.net/buyer-app?retryWrites=true&w=majority';
const targetURI = 'mongodb://127.0.0.1:27017/buyer-app'; 

async function migrateData() {
  console.log('Starting migration from Atlas to Local MongoDB...');

  try {
    // Connect to source database
    console.log(`Connecting to source database (Atlas)...`);
    const sourceConnection = await mongoose.createConnection(sourceURI).asPromise();
    console.log('Connected to source database.');

    // Connect to target database
    console.log(`Connecting to target database (Local)...`);
    const targetConnection = await mongoose.createConnection(targetURI).asPromise();
    console.log('Connected to target database.');

    const sourceDb = sourceConnection.db;
    const targetDb = targetConnection.db;

    // Get all collections from source
    const collections = await sourceDb.listCollections().toArray();
    
    for (const collectionInfo of collections) {
      const collectionName = collectionInfo.name;
      
      // Skip system collections just in case
      if (collectionName.startsWith('system.')) continue;
      
      console.log(`\nMigrating collection: ${collectionName}...`);
      
      const sourceCollection = sourceDb.collection(collectionName);
      const targetCollection = targetDb.collection(collectionName);
      
      // Fetch all documents from source
      const documents = await sourceCollection.find({}).toArray();
      
      if (documents.length > 0) {
        // Drop target collection if it exists to ensure a clean migration
        try {
            await targetCollection.drop();
            console.log(`  Dropped existing target collection ${collectionName} for clean insertion.`);
        } catch (err) {
            // Drop might fail if collection doesn't exist, which is fine
        }

        // Insert documents into target
        await targetCollection.insertMany(documents);
        console.log(`  Successfully migrated ${documents.length} documents into ${collectionName}.`);
      } else {
        console.log(`  Collection ${collectionName} is empty. Skipping.`);
      }
    }

    console.log('\nMigration completed successfully!');

    // Close connections
    await sourceConnection.close();
    await targetConnection.close();
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

migrateData();
