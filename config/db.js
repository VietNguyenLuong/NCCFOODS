const mongoose = require('mongoose');

async function connectDB() {
  try {
    await mongoose.connect('mongodb+srv://nguyenvietluong02072000_db_user:eX6hqDCRZJjqKgeL@nccfood.utql4va.mongodb.net/?appName=NCCFOOD');

    console.log('✅ MongoDB connected successfully');
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    process.exit(1);
  }
}

module.exports = connectDB;
