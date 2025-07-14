const Task = require('../models/task');

exports.getTasks = async (req, res) => {
  const tasks = await Task.find({});
  res.json(tasks);
};

exports.addTask = async (req, res) => {
  const { text } = req.body;
  const task = new Task({ text }); // No user field
  await task.save();
  res.status(201).json(task);
};

exports.deleteTask = async (req, res) => {
  await Task.deleteOne({ _id: req.params.id }); // No user field
  res.json({ success: true });
};

exports.updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const task = await Task.findByIdAndUpdate(id, updates, { new: true });
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: 'Error updating task', error: error.message });
  }
};