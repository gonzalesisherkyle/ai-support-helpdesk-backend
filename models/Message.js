const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  ticketId: { type: mongoose.Schema.Types.ObjectId, ref: 'Ticket', required: true },
  senderType: { type: String, enum: ['Customer', 'Agent', 'System', 'AI'], required: true },
  senderId: { type: mongoose.Schema.Types.ObjectId, refPath: 'senderModel' },
  senderModel: { type: String, enum: ['User', 'Customer'], required: function() { return ['Agent', 'Customer'].includes(this.senderType); } },
  body: { type: String, required: true },
  isInternal: { type: Boolean, default: false },
  attachments: [{
    name: String,
    url: String,
    mimeType: String
  }],
}, { timestamps: true });

module.exports = mongoose.model('Message', messageSchema);
