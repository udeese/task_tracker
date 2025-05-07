// server.js
require('dotenv').config();   

const express      = require('express');
const mongoose     = require('mongoose');
const path         = require('path');
const authRoutes   = require('./routes/auth');
const authMiddleware = require('./middleware/auth');

const app = express();

// 2) Middleware for JSON & static files
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// 3) Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB error:', err));

// 4) Mount auth routes (un-protected)
app.use('/api', authRoutes);  // exposes POST /api/signup and POST /api/login

// 5) Task model (with owner field)
const taskSchema = new mongoose.Schema({
  text: String,
  completed: { type: Boolean, default: false },
  owner:   { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

const Task = mongoose.model('Task', taskSchema);

// 6) Protect everything under /api/tasks
app.use('/api/tasks', authMiddleware);

// 7) Define your CRUD routes _once_ under /api/tasks
app.get('/api/tasks', async (req, res) => {
  const tasks = await Task.find({ owner: req.user.id });
  res.json(tasks);
});

app.post('/api/tasks', async (req, res) => {
  const newTask = await Task.create({
    text:  req.body.text,
    owner: req.user.id
  });
  res.status(201).json(newTask);
});

app.put('/api/tasks/:id', async (req, res) => {
  const updated = await Task.findOneAndUpdate(
    { _id: req.params.id, owner: req.user.id },
    req.body,
    { new: true }
  );
  res.json(updated);
});

app.delete('/api/tasks/:id', async (req, res) => {
  await Task.findOneAndDelete({ _id: req.params.id, owner: req.user.id });
  res.status(204).end();
});

// 8) Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
