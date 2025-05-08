// server.js
require('dotenv').config();
const express        = require('express');
const mongoose       = require('mongoose');
const path           = require('path');
const authRoutes     = require('./routes/auth');
const authMiddleware = require('./middleware/auth');

const app = express();

// parse JSON bodies
app.use(express.json());

// 1) auth endpoints (unprotected)
app.use('/api', authRoutes);

// 2) connect to Mongo
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// 3) task model
const taskSchema = new mongoose.Schema({
  text:      String,
  completed: { type: Boolean, default: false },
  owner:     { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
},{ timestamps: true });
const Task = mongoose.model('Task', taskSchema);

// 4) protect all /api/tasks
app.use('/api/tasks', authMiddleware);

// 5) CRUD
app.get('/api/tasks',       async (req, res) => {
  const tasks = await Task.find({ owner: req.user.id });
  res.json(tasks);
});
app.post('/api/tasks',      async (req, res) => {
  const t = await Task.create({ text: req.body.text, owner: req.user.id });
  res.status(201).json(t);
});
app.put('/api/tasks/:id',   async (req, res) => {
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

// 6) serve your React build
const clientDist = path.join(__dirname, 'client', 'dist');
app.use(express.static(clientDist));

// 7) catch‐all for client‐side routing
app.get('*', (req, res) => {
  res.sendFile(path.join(clientDist, 'index.html'));
});

// 8) start
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server listening on ${PORT}`));
