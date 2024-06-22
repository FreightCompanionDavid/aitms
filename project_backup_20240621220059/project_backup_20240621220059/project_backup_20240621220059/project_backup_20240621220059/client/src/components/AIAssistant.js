
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
