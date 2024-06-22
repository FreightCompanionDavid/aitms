
const mongoose = require('mongoose');

const DeliveryConfirmationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  // Add specific fields for DeliveryConfirmation
  exampleField: { type: String, required: true },
  // ... other fields
}, { timestamps: true });

module.exports = mongoose.model('DeliveryConfirmation', DeliveryConfirmationSchema);
  