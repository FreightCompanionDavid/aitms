// File: update_forms.js

const fs = require('fs');
const path = require('path');

const formTypes = [
  'BillOfLading',
  'ShippingRequest',
  'CustomsDeclaration',
  'ShippingLabel',
  'CommercialInvoice',
  'DeliveryNote',
  'PackingList',
  'ProofOfDelivery',
  'ShippersLetterOfInstruction',
  'DeliveryConfirmation',
  'Waybill',
  'QuickPass',
  'ExportImportLicense',
  'InsuranceCertificate'
];

// Update FormContainer.js
const formContainerContent = `
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
${formTypes.map(type => `import ${type} from '../../forms/${type}';`).join('\n')}
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
      ${formTypes.map(type => `case '${type.toLowerCase()}':
        return <${type} data={formData} onChange={handleFormChange} aiSuggestions={aiSuggestions} />;`).join('\n      ')}
      default:
        return <p>Please select a form type.</p>;
    }
  };

  return (
    <div>
      <select onChange={(e) => setFormType(e.target.value)}>
        <option value="">Select a form</option>
        ${formTypes.map(type => `<option value="${type.toLowerCase()}">${type.replace(/([A-Z])/g, ' $1').trim()}</option>`).join('\n        ')}
      </select>
      {renderForm()}
      <AIAssistant suggestions={aiSuggestions} />
    </div>
  );
};

export default FormContainer;
`;

fs.writeFileSync(path.join(__dirname, 'client', 'src', 'components', 'FormContainer.js'), formContainerContent);
console.log('Updated FormContainer.js');

// Create or update individual form components
formTypes.forEach(type => {
  const formContent = `
import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

const schema = yup.object().shape({
  // Add form-specific validation schema here
  exampleField: yup.string().required('This field is required'),
});

const ${type} = ({ data, onChange, aiSuggestions }) => {
  const { register, handleSubmit, errors, reset, setValue } = useForm({
    defaultValues: data,
    resolver: yupResolver(schema)
  });

  const onSubmit = async (formData) => {
    try {
      const response = await fetch('/api/forms/${type.toLowerCase()}', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + localStorage.getItem('token')
        },
        body: JSON.stringify(formData)
      });
      if (response.ok) {
        const result = await response.json();
        alert('${type.replace(/([A-Z])/g, ' $1').trim()} submitted successfully!');
        localStorage.removeItem('formDraft');
        reset();
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Submission failed');
      }
    } catch (error) {
      alert('Error submitting form: ' + error.message);
    }
  };

  const applySuggestion = (field, value) => {
    setValue(field, value);
    onChange({ ...data, [field]: value });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* Add form fields specific to ${type} here */}
      <input
        name="exampleField"
        ref={register}
        placeholder="Example Field"
        onChange={(e) => onChange({ ...data, exampleField: e.target.value })}
      />
      {errors.exampleField && <span>{errors.exampleField.message}</span>}
      {aiSuggestions.exampleField && (
        <button type="button" onClick={() => applySuggestion('exampleField', aiSuggestions.exampleField)}>
          Apply AI Suggestion: {aiSuggestions.exampleField}
        </button>
      )}
      
      <button type="submit">Submit</button>
    </form>
  );
};

export default ${type};
  `;

  fs.writeFileSync(path.join(__dirname, 'client', 'src', 'components', 'forms', `${type}.js`), formContent);
  console.log(`Created/Updated ${type}.js`);
});

// Update server-side route handler
const routeHandlerContent = `
const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
${formTypes.map(type => `const ${type} = require('../models/${type}');`).join('\n')}

${formTypes.map(type => `
router.post('/${type.toLowerCase()}', authenticateToken, async (req, res) => {
  try {
    const new${type} = new ${type}({
      ...req.body,
      userId: req.user.id
    });
    await new${type}.save();
    res.status(201).json({ message: '${type.replace(/([A-Z])/g, ' $1').trim()} saved successfully', id: new${type}._id });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/${type.toLowerCase()}/:id', authenticateToken, async (req, res) => {
  try {
    const form = await ${type}.findOne({ _id: req.params.id, userId: req.user.id });
    if (!form) {
      return res.status(404).json({ message: '${type.replace(/([A-Z])/g, ' $1').trim()} not found' });
    }
    res.json(form);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});`).join('\n')}

router.post('/ai/suggestions', authenticateToken, async (req, res) => {
  try {
    const { formType, data } = req.body;
    // Implement AI suggestion logic here
    // This is a placeholder implementation
    const suggestions = Object.keys(data).reduce((acc, key) => {
      acc[key] = \`AI suggested value for \${key}\`;
      return acc;
    }, {});
    res.json(suggestions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
`;

fs.writeFileSync(path.join(__dirname, 'server', 'routes', 'formRoutes.js'), routeHandlerContent);
console.log('Updated formRoutes.js');

// Create MongoDB models
formTypes.forEach(type => {
  const modelContent = `
const mongoose = require('mongoose');

const ${type}Schema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  // Add specific fields for ${type}
  exampleField: { type: String, required: true },
  // ... other fields
}, { timestamps: true });

module.exports = mongoose.model('${type}', ${type}Schema);
  `;

  fs.writeFileSync(path.join(__dirname, 'server', 'models', `${type}.js`), modelContent);
  console.log(`Created/Updated ${type} model`);
});

// Create AIAssistant component
const aiAssistantContent = `
import React from 'react';

const AIAssistant = ({ suggestions }) => {
  return (
    <div className="ai-assistant">
      <h3>AI Suggestions</h3>
      {Object.entries(suggestions).map(([field, suggestion]) => (
        <div key={field}>
          <strong>{field}:</strong> {suggestion}
        </div>
      ))}
    </div>
  );
};

export default AIAssistant;
`;

fs.writeFileSync(path.join(__dirname, 'client', 'src', 'components', 'AIAssistant.js'), aiAssistantContent);
console.log('Created AIAssistant.js');

console.log('All form components, routes, models, and AI integration have been created or updated.');

