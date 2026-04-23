const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  company: { type: String },
  plan: { type: String, enum: ['Free', 'Basic', 'Pro', 'Enterprise'], default: 'Free' },
  accountValue: { type: Number, default: 0 },
  isVIP: { type: Boolean, default: false },
  churnRisk: { type: Boolean, default: false },
  tags: [String],
}, { timestamps: true });

module.exports = mongoose.model('Customer', customerSchema);
