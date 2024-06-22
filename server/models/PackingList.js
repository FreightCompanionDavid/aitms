
const mongoose = require('mongoose');

const PackingListSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  // Add specific fields for PackingList
  exampleField: { type: String, required: true },
  // ... other fields
}, { timestamps: true });

module.exports = mongoose.model('PackingList', PackingListSchema);
  