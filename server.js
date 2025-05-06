require('dotenv').config(); // Load environment variables from .env file

// server
// This is a simple Express server that connects to MongoDB and serves a REST API for managing tasks.
// It uses Mongoose for MongoDB interactions and serves static files from the 'public' directory.
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const app = express();

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI)
.then(() => console.log('✅ MongoDB connected'))
.catch(err => console.error('❌ MongoDB error:', err));

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Task model
const taskSchema = new mongoose.Schema({
    text: String,
    completed: { type: Boolean, default: false }, 
}, { timestamps: true });

const Task = mongoose.model('Task', taskSchema);

// Routes
app.get(   '/api/tasks',           async (req, res) => { res.json(await Task.find()); });
app.post(  '/api/tasks',           async (req, res) => { res.status(201).json(await Task.create({ text: req.body.text })); });
app.put(   '/api/tasks/:id',       async (req, res) => { res.json(await Task.findByIdAndUpdate(req.params.id, req.body, { new: true })); });
app.delete('/api/tasks/:id',       async (req, res) => { await Task.findByIdAndDelete(req.params.id); res.status(204).end(); });

// Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));