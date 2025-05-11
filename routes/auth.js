// This file is part of the project "nodejs-jwt-auth".
//
// Project: nodejs-express-mongodb-jwt
// File: routes/auth.js
const express = require('express');
const jwt     = require('jsonwebtoken');
const bcrypt  = require('bcrypt');
const User    = require('../models/User');
const router  = express.Router();

router.post('/signup', async (req, res) => {
    const { email, password } = req.body;
    const hashed = await bcrypt.hash(password, 10);
    await User.create({ email, password: hashed });
    res.status(201).json({ message: 'User created' });
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Invalid creds' });
    const ok = await bcrypt.compare(password, user.password);
    if (!ok)    return res.status(401).json({ message: 'Invalid creds' });
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
});

module.exports = router;
