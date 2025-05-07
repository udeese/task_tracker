// test-conn.js
require('dotenv').config();
const mongoose = require('mongoose');

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ Local connection successful');
    process.exit(0);
  })
  .catch(err => {
    console.error('❌ Local connection failed:', err.message);
    process.exit(1);
  });
