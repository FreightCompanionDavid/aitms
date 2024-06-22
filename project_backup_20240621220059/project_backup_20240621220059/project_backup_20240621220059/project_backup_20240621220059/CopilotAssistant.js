import React from 'react';

const CopilotAssistant = ({ suggestions, onSuggestionApply }) => {
    return (
        <div className="copilot-assistant">
            <h3>🤖 Copilot Suggestions</h3>
            <ul>
                {suggestions.map((suggestion, index) => (
                    <li key={index}>
                        {suggestion}
                        <button onClick={() => onSuggestionApply(suggestion)}>Apply</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default CopilotAssistant;
