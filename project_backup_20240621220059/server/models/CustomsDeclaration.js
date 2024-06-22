
const mongoose = require('mongoose');

const CustomsDeclarationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  // Add specific fields for CustomsDeclaration
  exampleField: { type: String, required: true },
  // ... other fields
}, { timestamps: true });

module.exports = mongoose.model('CustomsDeclaration', CustomsDeclarationSchema);
  