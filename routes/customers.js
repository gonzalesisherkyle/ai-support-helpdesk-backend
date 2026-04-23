const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customerController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, customerController.getCustomers);
router.post('/', customerController.createCustomer); // Public for ticket form
router.get('/:id', protect, customerController.getCustomerById);

module.exports = router;
