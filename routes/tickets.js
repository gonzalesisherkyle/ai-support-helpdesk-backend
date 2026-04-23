const express = require('express');
const router = express.Router();
const ticketController = require('../controllers/ticketController');
const { protect } = require('../middleware/authMiddleware');

// Public routes (used by Customer Portal)
router.post('/', ticketController.createTicket);
router.post('/messages', ticketController.addMessage); // Restored for agent dashboard
router.get('/:id', ticketController.getTicketById);
router.post('/:id/messages', ticketController.addMessage); // Support for portal URL pattern

// Protected agent routes
router.get('/', protect, ticketController.getTickets);
router.patch('/:id', protect, ticketController.updateTicket);
router.get('/:id/ai-draft', protect, ticketController.getAiDraft);

module.exports = router;
