// server.js
require('dotenv').config();
const express        = require('express');
const mongoose       = require('mongoose');
const path           = require('path');
const authRoutes     = require('./routes/auth');
const authMiddleware = require('./middleware/auth');

const app = express();

// 1) JSON body parsing
app.use(express.json());

app.use((req, res, next) => {
    console.log('→', req.method, req.path)
    next()
  })
  app.use('/api', authRoutes)
  
// 3) Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB error:', err));

// 4) Task model
const taskSchema = new mongoose.Schema({
  text:      String,
  completed: { type: Boolean, default: false },
  owner:     { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

const Task = mongoose.model('Task', taskSchema);

// 5) Protect all /api/tasks endpoints
app.use('/api/tasks', authMiddleware);

// 6) CRUD for /api/tasks
app.get('/api/tasks',       async (req, res) => {
  const tasks = await Task.find({ owner: req.user.id });
  res.json(tasks);
});
app.post('/api/tasks',      async (req, res) => {
  const newTask = await Task.create({ text: req.body.text, owner: req.user.id });
  res.status(201).json(newTask);
});
app.put('/api/tasks/:id',   async (req, res) => {
  const updated = await Task.findOneAndUpdate(
    { _id: req.params.id, owner: req.user.id },
    req.body,
    { new: true }
  );
  res.json(updated);
});
app.delete('/api/tasks/:id', async (req, res) => {
  await Task.findOneAndDelete({ _id: req.params.id, owner: req.user.id });
  res.sendStatus(204);
});

// 7) Serve your React build
const clientDist = path.join(__dirname, 'client', 'dist');
app.use(express.static(clientDist));

// 8) Catch-all for client-side routes
app.get('/*', (req, res) => {
    res.sendFile(path.join(clientDist, 'index.html'))
  })
  
// 9) Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});
