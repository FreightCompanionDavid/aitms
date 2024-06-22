
const mongoose = require('mongoose');

const DeliveryNoteSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  // Add specific fields for DeliveryNote
  exampleField: { type: String, required: true },
  // ... other fields
}, { timestamps: true });

module.exports = mongoose.model('DeliveryNote', DeliveryNoteSchema);
  