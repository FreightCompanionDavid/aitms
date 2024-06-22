
const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const BillOfLading = require('../models/BillOfLading');
const ShippingRequest = require('../models/ShippingRequest');
const CustomsDeclaration = require('../models/CustomsDeclaration');
const ShippingLabel = require('../models/ShippingLabel');
const CommercialInvoice = require('../models/CommercialInvoice');
const DeliveryNote = require('../models/DeliveryNote');
const PackingList = require('../models/PackingList');
const ProofOfDelivery = require('../models/ProofOfDelivery');
const ShippersLetterOfInstruction = require('../models/ShippersLetterOfInstruction');
const DeliveryConfirmation = require('../models/DeliveryConfirmation');
const Waybill = require('../models/Waybill');
const QuickPass = require('../models/QuickPass');
const ExportImportLicense = require('../models/ExportImportLicense');
const InsuranceCertificate = require('../models/InsuranceCertificate');


router.post('/billoflading', authenticateToken, async (req, res) => {
  try {
    const newBillOfLading = new BillOfLading({
      ...req.body,
      userId: req.user.id
    });
    await newBillOfLading.save();
    res.status(201).json({ message: 'Bill Of Lading saved successfully', id: newBillOfLading._id });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/billoflading/:id', authenticateToken, async (req, res) => {
  try {
    const form = await BillOfLading.findOne({ _id: req.params.id, userId: req.user.id });
    if (!form) {
      return res.status(404).json({ message: 'Bill Of Lading not found' });
    }
    res.json(form);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/shippingrequest', authenticateToken, async (req, res) => {
  try {
    const newShippingRequest = new ShippingRequest({
      ...req.body,
      userId: req.user.id
    });
    await newShippingRequest.save();
    res.status(201).json({ message: 'Shipping Request saved successfully', id: newShippingRequest._id });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/shippingrequest/:id', authenticateToken, async (req, res) => {
  try {
    const form = await ShippingRequest.findOne({ _id: req.params.id, userId: req.user.id });
    if (!form) {
      return res.status(404).json({ message: 'Shipping Request not found' });
    }
    res.json(form);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/customsdeclaration', authenticateToken, async (req, res) => {
  try {
    const newCustomsDeclaration = new CustomsDeclaration({
      ...req.body,
      userId: req.user.id
    });
    await newCustomsDeclaration.save();
    res.status(201).json({ message: 'Customs Declaration saved successfully', id: newCustomsDeclaration._id });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/customsdeclaration/:id', authenticateToken, async (req, res) => {
  try {
    const form = await CustomsDeclaration.findOne({ _id: req.params.id, userId: req.user.id });
    if (!form) {
      return res.status(404).json({ message: 'Customs Declaration not found' });
    }
    res.json(form);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/shippinglabel', authenticateToken, async (req, res) => {
  try {
    const newShippingLabel = new ShippingLabel({
      ...req.body,
      userId: req.user.id
    });
    await newShippingLabel.save();
    res.status(201).json({ message: 'Shipping Label saved successfully', id: newShippingLabel._id });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/shippinglabel/:id', authenticateToken, async (req, res) => {
  try {
    const form = await ShippingLabel.findOne({ _id: req.params.id, userId: req.user.id });
    if (!form) {
      return res.status(404).json({ message: 'Shipping Label not found' });
    }
    res.json(form);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/commercialinvoice', authenticateToken, async (req, res) => {
  try {
    const newCommercialInvoice = new CommercialInvoice({
      ...req.body,
      userId: req.user.id
    });
    await newCommercialInvoice.save();
    res.status(201).json({ message: 'Commercial Invoice saved successfully', id: newCommercialInvoice._id });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/commercialinvoice/:id', authenticateToken, async (req, res) => {
  try {
    const form = await CommercialInvoice.findOne({ _id: req.params.id, userId: req.user.id });
    if (!form) {
      return res.status(404).json({ message: 'Commercial Invoice not found' });
    }
    res.json(form);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/deliverynote', authenticateToken, async (req, res) => {
  try {
    const newDeliveryNote = new DeliveryNote({
      ...req.body,
      userId: req.user.id
    });
    await newDeliveryNote.save();
    res.status(201).json({ message: 'Delivery Note saved successfully', id: newDeliveryNote._id });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/deliverynote/:id', authenticateToken, async (req, res) => {
  try {
    const form = await DeliveryNote.findOne({ _id: req.params.id, userId: req.user.id });
    if (!form) {
      return res.status(404).json({ message: 'Delivery Note not found' });
    }
    res.json(form);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/packinglist', authenticateToken, async (req, res) => {
  try {
    const newPackingList = new PackingList({
      ...req.body,
      userId: req.user.id
    });
    await newPackingList.save();
    res.status(201).json({ message: 'Packing List saved successfully', id: newPackingList._id });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/packinglist/:id', authenticateToken, async (req, res) => {
  try {
    const form = await PackingList.findOne({ _id: req.params.id, userId: req.user.id });
    if (!form) {
      return res.status(404).json({ message: 'Packing List not found' });
    }
    res.json(form);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/proofofdelivery', authenticateToken, async (req, res) => {
  try {
    const newProofOfDelivery = new ProofOfDelivery({
      ...req.body,
      userId: req.user.id
    });
    await newProofOfDelivery.save();
    res.status(201).json({ message: 'Proof Of Delivery saved successfully', id: newProofOfDelivery._id });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/proofofdelivery/:id', authenticateToken, async (req, res) => {
  try {
    const form = await ProofOfDelivery.findOne({ _id: req.params.id, userId: req.user.id });
    if (!form) {
      return res.status(404).json({ message: 'Proof Of Delivery not found' });
    }
    res.json(form);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/shippersletterofinstruction', authenticateToken, async (req, res) => {
  try {
    const newShippersLetterOfInstruction = new ShippersLetterOfInstruction({
      ...req.body,
      userId: req.user.id
    });
    await newShippersLetterOfInstruction.save();
    res.status(201).json({ message: 'Shippers Letter Of Instruction saved successfully', id: newShippersLetterOfInstruction._id });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/shippersletterofinstruction/:id', authenticateToken, async (req, res) => {
  try {
    const form = await ShippersLetterOfInstruction.findOne({ _id: req.params.id, userId: req.user.id });
    if (!form) {
      return res.status(404).json({ message: 'Shippers Letter Of Instruction not found' });
    }
    res.json(form);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/deliveryconfirmation', authenticateToken, async (req, res) => {
  try {
    const newDeliveryConfirmation = new DeliveryConfirmation({
      ...req.body,
      userId: req.user.id
    });
    await newDeliveryConfirmation.save();
    res.status(201).json({ message: 'Delivery Confirmation saved successfully', id: newDeliveryConfirmation._id });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/deliveryconfirmation/:id', authenticateToken, async (req, res) => {
  try {
    const form = await DeliveryConfirmation.findOne({ _id: req.params.id, userId: req.user.id });
    if (!form) {
      return res.status(404).json({ message: 'Delivery Confirmation not found' });
    }
    res.json(form);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/waybill', authenticateToken, async (req, res) => {
  try {
    const newWaybill = new Waybill({
      ...req.body,
      userId: req.user.id
    });
    await newWaybill.save();
    res.status(201).json({ message: 'Waybill saved successfully', id: newWaybill._id });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/waybill/:id', authenticateToken, async (req, res) => {
  try {
    const form = await Waybill.findOne({ _id: req.params.id, userId: req.user.id });
    if (!form) {
      return res.status(404).json({ message: 'Waybill not found' });
    }
    res.json(form);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/quickpass', authenticateToken, async (req, res) => {
  try {
    const newQuickPass = new QuickPass({
      ...req.body,
      userId: req.user.id
    });
    await newQuickPass.save();
    res.status(201).json({ message: 'Quick Pass saved successfully', id: newQuickPass._id });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/quickpass/:id', authenticateToken, async (req, res) => {
  try {
    const form = await QuickPass.findOne({ _id: req.params.id, userId: req.user.id });
    if (!form) {
      return res.status(404).json({ message: 'Quick Pass not found' });
    }
    res.json(form);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/exportimportlicense', authenticateToken, async (req, res) => {
  try {
    const newExportImportLicense = new ExportImportLicense({
      ...req.body,
      userId: req.user.id
    });
    await newExportImportLicense.save();
    res.status(201).json({ message: 'Export Import License saved successfully', id: newExportImportLicense._id });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/exportimportlicense/:id', authenticateToken, async (req, res) => {
  try {
    const form = await ExportImportLicense.findOne({ _id: req.params.id, userId: req.user.id });
    if (!form) {
      return res.status(404).json({ message: 'Export Import License not found' });
    }
    res.json(form);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/insurancecertificate', authenticateToken, async (req, res) => {
  try {
    const newInsuranceCertificate = new InsuranceCertificate({
      ...req.body,
      userId: req.user.id
    });
    await newInsuranceCertificate.save();
    res.status(201).json({ message: 'Insurance Certificate saved successfully', id: newInsuranceCertificate._id });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/insurancecertificate/:id', authenticateToken, async (req, res) => {
  try {
    const form = await InsuranceCertificate.findOne({ _id: req.params.id, userId: req.user.id });
    if (!form) {
      return res.status(404).json({ message: 'Insurance Certificate not found' });
    }
    res.json(form);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/ai/suggestions', authenticateToken, async (req, res) => {
  try {
    const { formType, data } = req.body;
    // Implement AI suggestion logic here
    // This is a placeholder implementation
    const suggestions = Object.keys(data).reduce((acc, key) => {
      acc[key] = `AI suggested value for ${key}`;
      return acc;
    }, {});
    res.json(suggestions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
