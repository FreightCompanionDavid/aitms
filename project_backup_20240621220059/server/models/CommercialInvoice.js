
const mongoose = require('mongoose');

const CommercialInvoiceSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  // Add specific fields for CommercialInvoice
  exampleField: { type: String, required: true },
  // ... other fields
}, { timestamps: true });

module.exports = mongoose.model('CommercialInvoice', CommercialInvoiceSchema);
  