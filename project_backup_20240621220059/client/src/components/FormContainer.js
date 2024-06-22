
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import BillOfLading from '../../forms/BillOfLading';
import ShippingRequest from '../../forms/ShippingRequest';
import CustomsDeclaration from '../../forms/CustomsDeclaration';
import ShippingLabel from '../../forms/ShippingLabel';
import CommercialInvoice from '../../forms/CommercialInvoice';
import DeliveryNote from '../../forms/DeliveryNote';
import PackingList from '../../forms/PackingList';
import ProofOfDelivery from '../../forms/ProofOfDelivery';
import ShippersLetterOfInstruction from '../../forms/ShippersLetterOfInstruction';
import DeliveryConfirmation from '../../forms/DeliveryConfirmation';
import Waybill from '../../forms/Waybill';
import QuickPass from '../../forms/QuickPass';
import ExportImportLicense from '../../forms/ExportImportLicense';
import InsuranceCertificate from '../../forms/InsuranceCertificate';
import AIAssistant from '../../AIAssistant';

const FormContainer = () => {
  const [formType, setFormType] = useState('');
  const [formData, setFormData] = useState({});
  const { currentUser } = useAuth();
  const [aiSuggestions, setAISuggestions] = useState({});

  useEffect(() => {
    const savedDraft = localStorage.getItem('formDraft');
    if (savedDraft) {
      setFormData(JSON.parse(savedDraft));
    }
  }, []);

  const handleFormChange = (newData) => {
    setFormData(newData);
    localStorage.setItem('formDraft', JSON.stringify(newData));
    // Trigger AI suggestions on form change
    getAISuggestions(newData);
  };

  const getAISuggestions = async (data) => {
    try {
      const response = await fetch('/api/ai/suggestions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ formType, data })
      });
      if (response.ok) {
        const suggestions = await response.json();
        setAISuggestions(suggestions);
      }
    } catch (error) {
      console.error('Error getting AI suggestions:', error);
    }
  };

  const renderForm = () => {
    if (!currentUser) {
      return <p>Please log in to access forms.</p>;
    }

    switch(formType) {
      case 'billoflading':
        return <BillOfLading data={formData} onChange={handleFormChange} aiSuggestions={aiSuggestions} />;
      case 'shippingrequest':
        return <ShippingRequest data={formData} onChange={handleFormChange} aiSuggestions={aiSuggestions} />;
      case 'customsdeclaration':
        return <CustomsDeclaration data={formData} onChange={handleFormChange} aiSuggestions={aiSuggestions} />;
      case 'shippinglabel':
        return <ShippingLabel data={formData} onChange={handleFormChange} aiSuggestions={aiSuggestions} />;
      case 'commercialinvoice':
        return <CommercialInvoice data={formData} onChange={handleFormChange} aiSuggestions={aiSuggestions} />;
      case 'deliverynote':
        return <DeliveryNote data={formData} onChange={handleFormChange} aiSuggestions={aiSuggestions} />;
      case 'packinglist':
        return <PackingList data={formData} onChange={handleFormChange} aiSuggestions={aiSuggestions} />;
      case 'proofofdelivery':
        return <ProofOfDelivery data={formData} onChange={handleFormChange} aiSuggestions={aiSuggestions} />;
      case 'shippersletterofinstruction':
        return <ShippersLetterOfInstruction data={formData} onChange={handleFormChange} aiSuggestions={aiSuggestions} />;
      case 'deliveryconfirmation':
        return <DeliveryConfirmation data={formData} onChange={handleFormChange} aiSuggestions={aiSuggestions} />;
      case 'waybill':
        return <Waybill data={formData} onChange={handleFormChange} aiSuggestions={aiSuggestions} />;
      case 'quickpass':
        return <QuickPass data={formData} onChange={handleFormChange} aiSuggestions={aiSuggestions} />;
      case 'exportimportlicense':
        return <ExportImportLicense data={formData} onChange={handleFormChange} aiSuggestions={aiSuggestions} />;
      case 'insurancecertificate':
        return <InsuranceCertificate data={formData} onChange={handleFormChange} aiSuggestions={aiSuggestions} />;
      default:
        return <p>Please select a form type.</p>;
    }
  };

  return (
    <div>
      <select onChange={(e) => setFormType(e.target.value)}>
        <option value="">Select a form</option>
        <option value="billoflading">Bill Of Lading</option>
        <option value="shippingrequest">Shipping Request</option>
        <option value="customsdeclaration">Customs Declaration</option>
        <option value="shippinglabel">Shipping Label</option>
        <option value="commercialinvoice">Commercial Invoice</option>
        <option value="deliverynote">Delivery Note</option>
        <option value="packinglist">Packing List</option>
        <option value="proofofdelivery">Proof Of Delivery</option>
        <option value="shippersletterofinstruction">Shippers Letter Of Instruction</option>
        <option value="deliveryconfirmation">Delivery Confirmation</option>
        <option value="waybill">Waybill</option>
        <option value="quickpass">Quick Pass</option>
        <option value="exportimportlicense">Export Import License</option>
        <option value="insurancecertificate">Insurance Certificate</option>
      </select>
      {renderForm()}
      <AIAssistant suggestions={aiSuggestions} />
    </div>
  );
};

export default FormContainer;

