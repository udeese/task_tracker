// server.js
require('dotenv').config();

const express        = require('express');
const mongoose       = require('mongoose');
const path           = require('path');
const authRoutes     = require('./routes/auth');
const authMiddleware = require('./middleware/auth');

const app = express();

app.use(express.json());


mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB error:', err));


app.use('/api', authRoutes);  // POST /api/signup, POST /api/login

app.use('/api/tasks', authMiddleware);

const Task = mongoose.model('Task', new mongoose.Schema({
  text:      String,
  completed: { type: Boolean, default: false },
  owner:     { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true }));

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
  res.sendStatus(204);
});

const clientDist = path.join(__dirname, 'client/dist');
app.use(express.static(clientDist));

app.get('*', (req, res) => {
  res.sendFile(path.join(clientDist, 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
