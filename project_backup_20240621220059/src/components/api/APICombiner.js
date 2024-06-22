import React, { useState, useEffect, useCallback } from 'react';
import AIAssistant from '../../utils/AIAssistant';
import { toast } from 'react-toastify';

const APICombiner = ({ onCombineRequest }) => {
    const [goal, setGoal] = useState('');
    const [availableApis, setAvailableApis] = useState([]);
    const [selectedApis, setSelectedApis] = useState([]);
    const [suggestion, setSuggestion] = useState('');
    const [interactiveExample, setInteractiveExample] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const aiAssistant = new AIAssistant();

    const fetchAvailableApis = useCallback(async () => {
        try {
            // Mock API call
            const mockApis = [
                { name: 'FreightBooks API', url: 'https://api.freightbooks.com/swagger.json' },
                { name: 'Shipping Partner API', url: 'https://api.shippingpartner.com/swagger.json' },
                { name: 'Logistics API', url: 'https://api.logistics.com/swagger.json' },
            ];
            setAvailableApis(mockApis);
        } catch (error) {
            console.error('Error fetching available APIs:', error);
            setError('Failed to fetch available APIs. Please try again.');
            toast.error('Failed to fetch available APIs. Please try again.');
        }
    }, []);

    useEffect(() => {
        fetchAvailableApis();
    }, [fetchAvailableApis]);

    const handleApiSelection = (apiName) => {
        setSelectedApis(prevApis => 
            prevApis.includes(apiName) 
                ? prevApis.filter(api => api !== apiName)
                : [...prevApis, apiName]
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!goal.trim() || selectedApis.length === 0) {
            toast.warn('Please enter a goal and select at least one API.');
            return;
        }
        setLoading(true);
        setError(null);
        try {
            const result = await onCombineRequest(goal, selectedApis);
            setSuggestion(result.suggestion);
            setInteractiveExample(result.interactiveExample);
            toast.success('API combination suggestion generated successfully!');
        } catch (error) {
            console.error('Error generating API combination:', error);
            setError('Failed to generate API combination. Please try again.');
            toast.error('Failed to generate API combination. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleCopy = (text) => {
        navigator.clipboard.writeText(text)
            .then(() => toast.success('Copied to clipboard!'))
            .catch(() => toast.error('Failed to copy. Please try again.'));
    };

    return (
        <div className="api-combiner">
            <h2>Combine APIs</h2>
            <form onSubmit={handleSubmit}>
                <textarea
                    value={goal}
                    onChange={(e) => setGoal(e.target.value)}
                    placeholder="Describe your goal for combining APIs..."
                    rows={4}
                    cols={50}
                    required
                />
                <div className="api-selection">
                    <h3>Select APIs to combine:</h3>
                    {availableApis.map(api => (
                        <label key={api.name}>
                            <input
                                type="checkbox"
                                checked={selectedApis.includes(api.name)}
                                onChange={() => handleApiSelection(api.name)}
                            />
                            {api.name}
                        </label>
                    ))}
                </div>
                <button type="submit" disabled={loading}>
                    {loading ? 'Generating...' : 'Get Combination Suggestion'}
                </button>
            </form>
            {error && <div className="error">{error}</div>}
            {suggestion && (
                <div className="suggestion">
                    <h3>API Combination Suggestion:</h3>
                    <pre>{suggestion}</pre>
                    <button onClick={() => handleCopy(suggestion)}>Copy Suggestion</button>
                </div>
            )}
            {interactiveExample && (
                <div className="interactive-example">
                    <h3>Interactive Example:</h3>
                    <pre>{interactiveExample}</pre>
                    <button onClick={() => handleCopy(interactiveExample)}>Copy Example</button>
                </div>
            )}
        </div>
    );
};

export default APICombiner;

