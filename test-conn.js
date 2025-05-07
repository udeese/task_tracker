// test-conn.js
// This script is used to test the connection to the MongoDB database.
// It connects to the database using Mongoose and logs the result to the console.
// It uses the connection string stored in the .env file.
// It is a simple script that can be run independently to check if the database connection is working correctly.
// It is useful for debugging and ensuring that the database is accessible before running the main application.
// It is a standalone script that does not require the rest of the application to be running.
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
