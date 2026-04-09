const { MongoClient } = require('mongodb');

// 1. YOUR CONNECTIONS
const LOCAL_URI = "mongodb://127.0.0.1:27017";
const LOCAL_DB_NAME = "suratgarment"; // Name of your local DB

// REPLACE THIS with your Atlas string (include your password!)
const ATLAS_URI = "mongodb+srv://yasoni715_db_user:HhSOyRW55x3nbmi3@cluster0.6m7z1tp.mongodb.net/suratgarment?retryWrites=true&w=majority&appName=Cluster0";
const ATLAS_DB_NAME = "suratgarment";

async function migrate() {
    const localClient = new MongoClient(LOCAL_URI);
    const atlasClient = new MongoClient(ATLAS_URI);

    try {
        await localClient.connect();
        await atlasClient.connect();
        console.log("✅ Connected to both Local and Atlas");

        const localDb = localClient.db(LOCAL_DB_NAME);
        const atlasDb = atlasClient.db(ATLAS_DB_NAME);

        const collections = await localDb.listCollections().toArray();
        console.log(`📦 Found ${collections.length} collections to migrate...`);

        for (const colDef of collections) {
            const colName = colDef.name;
            if (colName.startsWith('system.')) continue;
            
            console.log(`➡️ Migrating: ${colName}...`);

            const data = await localDb.collection(colName).find({}).toArray();
            
            if (data.length > 0) {
                // Clear existing data in Atlas first (Optional)
                await atlasDb.collection(colName).deleteMany({});
                // Insert new data
                await atlasDb.collection(colName).insertMany(data);
                console.log(`   ✅ Done (${data.length} documents)`);
            } else {
                console.log(`   ⚠️ Collection is empty, skipping.`);
            }
        }

        console.log("\n✨ MIGRATION COMPLETE! Everything is now on Atlas.");
    } catch (err) {
        console.error("❌ Migration failed:", err);
    } finally {
        await localClient.close();
        await atlasClient.close();
    }
}

migrate();
