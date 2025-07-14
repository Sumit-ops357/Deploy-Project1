const express = require('express');
const { register, login, getUserData } = require('../controllers/userController');
// const auth = require('../middleware/auth');
const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', getUserData);

module.exports = router;