// server.js
require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const authRoutes = require('./routes/auth');
const authMiddleware = require('./middleware/auth');

const app = express();

// 1) JSON body parsing
app.use(express.json());

// 2) Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
.then(() => console.log('✅ MongoDB connected'))
.catch(err => console.error('❌ MongoDB error:', err));

// 3) Auth routes (no auth required)
app.use('/api', authRoutes);  // POST /api/signup, POST /api/login

// 4) Protect task routes
app.use('/api/tasks', authMiddleware);

// 5) Task model & CRUD
const Task = mongoose.model('Task', new mongoose.Schema({
text:      String,
completed: { type: Boolean, default: false },
owner:     { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true }));

app.get   ('/api/tasks',     async (req, res) => res.json(await Task.find({ owner: req.user.id })));
app.post  ('/api/tasks',     async (req, res) => {
const t = await Task.create({ text: req.body.text, owner: req.user.id });
res.status(201).json(t);
});
app.put   ('/api/tasks/:id', async (req, res) => {
const u = await Task.findOneAndUpdate(
    { _id: req.params.id, owner: req.user.id },
    req.body,
    { new: true }
);
res.json(u);
});
app.delete('/api/tasks/:id', async (req, res) => {
await Task.findOneAndDelete({ _id: req.params.id, owner: req.user.id });
res.sendStatus(204);
});

// 6) Serve the React build
const clientDist = path.join(__dirname, 'client/dist');
app.use(express.static(clientDist));

// 7) Catch-all for client-side routing 
app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/dist', 'index.html'));
});

// 8) Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
