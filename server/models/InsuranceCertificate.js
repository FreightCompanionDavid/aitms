
const mongoose = require('mongoose');

const InsuranceCertificateSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  // Add specific fields for InsuranceCertificate
  exampleField: { type: String, required: true },
  // ... other fields
}, { timestamps: true });

module.exports = mongoose.model('InsuranceCertificate', InsuranceCertificateSchema);
  