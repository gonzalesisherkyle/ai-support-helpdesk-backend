const Ticket = require('../models/Ticket');
const Message = require('../models/Message');
const AiService = require('../services/AiService');
const RagService = require('../services/RagService');

exports.createTicket = async (req, res) => {
  try {
    const { subject, description, customerId } = req.body;
    const ticket = new Ticket({
      subject,
      description,
      customerId,
      status: 'New'
    });
    
    // Initial AI Analysis
    const analysis = await AiService.analyzeTicket(ticket, []);
    if (analysis) {
      ticket.aiAnalysis = analysis;
      ticket.category = analysis.category;
      ticket.priority = analysis.urgencyScore > 7 ? 'Urgent' : analysis.urgencyScore > 5 ? 'High' : 'Medium';
    }

    await ticket.save();
    res.status(201).json(ticket);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getTickets = async (req, res) => {
  try {
    const tickets = await Ticket.find().populate('customerId', 'name email company').sort({ createdAt: -1 });
    res.json(tickets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getTicketById = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id).populate('customerId assignedTo');
    const messages = await Message.find({ ticketId: req.params.id }).sort({ createdAt: 1 });
    res.json({ ticket, messages });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.addMessage = async (req, res) => {
  try {
    const { body, senderType, isInternal } = req.body;
    const ticketId = req.params.id || req.body.ticketId;
    
    const ticket = await Ticket.findById(ticketId);
    if (!ticket) return res.status(404).json({ message: 'Ticket not found' });

    const message = new Message({
      ticketId,
      body,
      senderType,
      senderId: req.user ? req.user.id : ticket.customerId,
      senderModel: req.user ? 'User' : 'Customer',
      isInternal: isInternal || false
    });
    await message.save();

    // Update ticket status if it was New
    await Ticket.findByIdAndUpdate(ticketId, { status: 'Open' });

    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAiDraft = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id).populate('customerId');
    const context = await RagService.getContextForQuery(ticket.subject + " " + ticket.description);
    const draft = await AiService.generateReplyDraft(ticket, ticket.customerId, context, ticket.description);
    res.json({ draft, contextUsed: context !== "No relevant knowledge base articles found." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
exports.updateTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(ticket);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
