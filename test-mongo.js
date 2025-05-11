require('dotenv').config();
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ MongoDB test connection successful');
    process.exit(0);
  })
  .catch(err => {
    console.error('❌ MongoDB test connection failed:', err.message);
    process.exit(1);
  });