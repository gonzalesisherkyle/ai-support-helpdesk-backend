const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', authController.register);
router.post('/verify', authController.verifyEmail);
router.post('/login', authController.login);
router.get('/me', protect, authController.getMe);
router.get('/agents', protect, authController.getAgents);

module.exports = router;
