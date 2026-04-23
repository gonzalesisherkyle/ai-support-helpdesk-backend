const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);
router.get('/dashboard', authorize('Admin', 'Support Manager', 'Agent'), analyticsController.getDashboardStats);

module.exports = router;
