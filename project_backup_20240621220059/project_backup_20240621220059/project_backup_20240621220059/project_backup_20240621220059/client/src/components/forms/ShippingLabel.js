
import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

const schema = yup.object().shape({
  // Add form-specific validation schema here
  exampleField: yup.string().required('This field is required'),
});

const ShippingLabel = ({ data, onChange, aiSuggestions }) => {
  const { register, handleSubmit, errors, reset, setValue } = useForm({
    defaultValues: data,
    resolver: yupResolver(schema)
  });

  const onSubmit = async (formData) => {
    try {
      const response = await fetch('/api/forms/shippinglabel', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + localStorage.getItem('token')
        },
        body: JSON.stringify(formData)
      });
      if (response.ok) {
        const result = await response.json();
        alert('Shipping Label submitted successfully!');
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
      {/* Add form fields specific to ShippingLabel here */}
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

export default ShippingLabel;
  