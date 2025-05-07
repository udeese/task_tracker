// This file defines the User model for the application using Mongoose.
// It includes fields for email and password hash, with validation rules.
// The model is exported for use in other parts of the application.
// user.js

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
},
passwordHash: {
    type: String,
    required: true
}
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
