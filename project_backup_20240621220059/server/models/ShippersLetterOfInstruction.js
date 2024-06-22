
const mongoose = require('mongoose');

const ShippersLetterOfInstructionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  // Add specific fields for ShippersLetterOfInstruction
  exampleField: { type: String, required: true },
  // ... other fields
}, { timestamps: true });

module.exports = mongoose.model('ShippersLetterOfInstruction', ShippersLetterOfInstructionSchema);
  