const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
  subject: { type: String, required: true },
  description: { type: String },
  channel: { type: String, enum: ['Email', 'Web', 'Chat', 'API'], default: 'Web' },
  status: { 
    type: String, 
    enum: ['New', 'Open', 'Waiting for Customer', 'Escalated', 'Resolved', 'Closed'], 
    default: 'New' 
  },
  priority: { 
    type: String, 
    enum: ['Low', 'Medium', 'High', 'Urgent'], 
    default: 'Medium' 
  },
  category: { type: String },
  subcategory: { type: String },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  assignedTeam: { type: mongoose.Schema.Types.ObjectId, ref: 'Team' },
  slaPolicyId: { type: mongoose.Schema.Types.ObjectId, ref: 'SLAPolicy' },
  firstResponseDueAt: { type: Date },
  resolutionDueAt: { type: Date },
  tags: [String],
  aiAnalysis: {
    summary: String,
    category: String,
    subcategory: String,
    urgencyScore: Number,
    sentiment: String,
    confidence: Number,
    recommendedRoute: String,
    escalationRequired: Boolean,
  }
}, { timestamps: true });

module.exports = mongoose.model('Ticket', ticketSchema);
