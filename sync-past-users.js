const mongoose = require('mongoose');
const axios = require('axios');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const User = require('./models/User');

mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/suratgarment', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(async () => {
    console.log('DB Connected - Starting Store Sync...');
    const users = await User.find({});
    console.log(`Found ${users.length} users...`);
    for (const user of users) {
      try {
        await axios.post('http://localhost:3000/api/sync/store', { // Make sure buyer-app is running on 3000
          adminStoreId: user.storeId,
          storeName: user.storeName,
          storeLogo: user.storeLogo,
          email: user.email,
          contactNumber: user.contactNumber
        });
        console.log('✅ Synced:', user.email);
      } catch (e) {
        console.log('❌ Failed:', user.email, e.message);
      }
    }
    console.log('Sync Complete.');
    process.exit();
  })
  .catch((err) => {
    console.error('DB Connection Error:', err);
    process.exit(1);
  });
