
const mongoose = require('mongoose');

const ExportImportLicenseSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  // Add specific fields for ExportImportLicense
  exampleField: { type: String, required: true },
  // ... other fields
}, { timestamps: true });

module.exports = mongoose.model('ExportImportLicense', ExportImportLicenseSchema);
  