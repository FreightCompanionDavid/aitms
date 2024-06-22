
const mongoose = require('mongoose');

const ShippingLabelSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  // Add specific fields for ShippingLabel
  exampleField: { type: String, required: true },
  // ... other fields
}, { timestamps: true });

module.exports = mongoose.model('ShippingLabel', ShippingLabelSchema);
  