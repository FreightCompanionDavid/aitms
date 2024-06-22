
const mongoose = require('mongoose');

const QuickPassSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  // Add specific fields for QuickPass
  exampleField: { type: String, required: true },
  // ... other fields
}, { timestamps: true });

module.exports = mongoose.model('QuickPass', QuickPassSchema);
  