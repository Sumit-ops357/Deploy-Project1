const mongoose = require('mongoose');

const pomodoroSessionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
  mode: { type: String, enum: ['Work', 'Break'], required: true },
  duration: { type: Number, required: true }, // in seconds
  completedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('PomodoroSession', pomodoroSessionSchema);