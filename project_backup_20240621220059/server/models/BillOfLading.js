
const mongoose = require('mongoose');

const BillOfLadingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  // Add specific fields for BillOfLading
  exampleField: { type: String, required: true },
  // ... other fields
}, { timestamps: true });

module.exports = mongoose.model('BillOfLading', BillOfLadingSchema);
  