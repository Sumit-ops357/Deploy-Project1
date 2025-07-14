const express = require('express');
const { addSession, getSessions } = require('../controllers/pomodoroController');
// const auth = require('../middleware/auth'); // You can comment this out or remove it
const router = express.Router();

router.post('/', addSession);
router.get('/', getSessions);

module.exports = router;