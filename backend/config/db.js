const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      maxPoolSize:               10,   // Reuse up to 10 connections (default 5)
      serverSelectionTimeoutMS:  5000, // Fail fast if Atlas is unreachable
      socketTimeoutMS:           45000,
      family:                    4,    // Force IPv4 — prevents IPv6 lookup delay
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
