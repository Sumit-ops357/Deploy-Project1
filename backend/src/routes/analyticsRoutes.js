const express = require('express');
const { getAnalytics, getWeeklyProgress } = require('../controllers/analyticsController');
const router = express.Router();

// Get comprehensive analytics data
router.get('/', getAnalytics);

// Get weekly progress data
router.get('/weekly', getWeeklyProgress);

module.exports = router; 