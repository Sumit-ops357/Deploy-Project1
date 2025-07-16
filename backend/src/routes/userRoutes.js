const express = require('express');
const router = express.Router();
// Import your User model here
const User = require('../models/user');

// Registration route
router.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body;
    // Add validation and hashing as needed
    const user = new User({ email, password });
    await user.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Registration failed', details: err.message });
  }
});

module.exports = router;