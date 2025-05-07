// Project: nodejs-auth-api 
// File: routes/auth.js
// Description: This file contains the authentication routes for the application.
// It includes routes for user signup and login, using JWT for authentication.
// It uses bcrypt for password hashing and Mongoose for database interactions.

const express  = require('express');
const bcrypt   = require('bcrypt');
const jwt      = require('jsonwebtoken');
const User     = require('../models/User');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'change_this_to_strong';

// POST /api/signup
router.post('/signup', async (req, res) => {
const { email, password } = req.body;
if (!email || !password) return res.status(400).json({ message: 'Email & password required' });

const existing = await User.findOne({ email });
if (existing) return res.status(409).json({ message: 'Email already in use' });

const passwordHash = await bcrypt.hash(password, 10);
const user = await User.create({ email, passwordHash });
res.status(201).json({ message: 'User created' });
});

// POST /api/login
router.post('/login', async (req, res) => {
const { email, password } = req.body;
const user = await User.findOne({ email });
if (!user) return res.status(401).json({ message: 'Invalid credentials' });

const ok = await bcrypt.compare(password, user.passwordHash);
if (!ok) return res.status(401).json({ message: 'Invalid credentials' });

// Issue token:
const token = jwt.sign(
    { sub: user._id, email: user.email },
    JWT_SECRET,
    { expiresIn: '1h' }
);
res.json({ token });
});

module.exports = router;
