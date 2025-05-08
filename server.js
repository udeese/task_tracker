// server.js
require('dotenv').config();       // 1) load .env

const express        = require('express');
const mongoose       = require('mongoose');
const path           = require('path');
const authRoutes     = require('./routes/auth');
const authMiddleware = require('./middleware/auth');

const app = express();

// 2) JSON body parsing
app.use(express.json());

// 3) Un-protected auth endpoints
//    → POST /api/signup
//    → POST /api/login
app.use('/api', authRoutes);

// 4) Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI, {
    // these options are now defaults in mongoose 6+, but harmless to leave
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// 5) Task schema + model
const taskSchema = new mongoose.Schema({
  text:      String,
  completed: { type: Boolean, default: false },
  owner:     { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

const Task = mongoose.model('Task', taskSchema);

// 6) Protect everything under /api/tasks
app.use('/api/tasks', authMiddleware);

// 7) CRUD routes for tasks
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

// 8) Serve React’s production build
const clientDist = path.join(__dirname, 'client', 'dist');
app.use(express.static(clientDist));

// 9) “Catch-all” to send back index.html for client‐side routing
app.get('*', (req, res) => {
  res.sendFile(path.join(clientDist, 'index.html'));
});

// 10) Launch
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
