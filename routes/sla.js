const express = require('express');
const router = express.Router();
const slaController = require('../controllers/slaController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);
router.get('/', slaController.getPolicies);
router.post('/', authorize('Admin'), slaController.createPolicy);

module.exports = router;
