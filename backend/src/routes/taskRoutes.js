const express = require('express');
const { getTasks, addTask, deleteTask, updateTask } = require('../controllers/taskController');
// const auth = require('../middleware/auth');
const router = express.Router();
const Task = require('../models/task');

router.get('/', getTasks);
router.post('/', addTask);
router.delete('/:id', deleteTask);
router.put('/:id', updateTask);

// Update a task (toggle completed)
router.put('/:id', async (req, res) => {
  try {
    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedTask) return res.status(404).json({ message: 'Task not found' });
    res.json(updatedTask);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;