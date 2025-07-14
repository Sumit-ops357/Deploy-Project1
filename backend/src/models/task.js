const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  // For demo mode, remove or comment out the user field:
  // user: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: 'User',
  //   required: true
  // },
  text: String,
  completed: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Task', taskSchema);