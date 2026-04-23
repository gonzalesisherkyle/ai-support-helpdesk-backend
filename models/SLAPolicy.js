const mongoose = require('mongoose');

const slaPolicySchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  priority: { type: String, enum: ['Low', 'Medium', 'High', 'Urgent'], required: true },
  firstResponseTime: { type: Number }, // in minutes
  resolutionTime: { type: Number }, // in minutes
  isDefault: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('SLAPolicy', slaPolicySchema);
