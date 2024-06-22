
const mongoose = require('mongoose');

const ProofOfDeliverySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  // Add specific fields for ProofOfDelivery
  exampleField: { type: String, required: true },
  // ... other fields
}, { timestamps: true });

module.exports = mongoose.model('ProofOfDelivery', ProofOfDeliverySchema);
  