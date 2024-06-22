import React, { useState, useEffect } from 'react';
import SwaggerParser from 'swagger-parser';
import OpenAI from 'openai';

const APITester = () => {
    const [apiSpecs, setApiSpecs] = useState([]);
    const [unifiedDictionary, setUnifiedDictionary] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [endpoint, setEndpoint] = useState('');
    const [method, setMethod] = useState('GET');
    const [requestBody, setRequestBody] = useState('');
    const [response, setResponse] = useState(null);

    const openai = new OpenAI({ apiKey: process.env.REACT_APP_OPENAI_API_KEY });

    useEffect(() => {
        fetchApiSpecs();
    }, []);

    const fetchApiSpecs = async () => {
        setLoading(true);
        try {
            const spec1 = await SwaggerParser.parse('https://api1.freightbooks.com/swagger.json');
            const spec2 = await SwaggerParser.parse('https://api2.freightbooks.com/swagger.json');
            setApiSpecs([spec1, spec2]);
        } catch (error) {
            setError('Error fetching API specs: ' + error.message);
        }
        setLoading(false);
    };

    const generateUnifiedDictionary = async () => {
        setLoading(true);
        try {
            const prompt = `Given the following two API specifications:

API 1:
${JSON.stringify(apiSpecs[0], null, 2)}

API 2:
${JSON.stringify(apiSpecs[1], null, 2)}

Generate a unified API dictionary that combines and simplifies these APIs for easy use. The dictionary should include:
1. Endpoint names
2. HTTP methods
3. Brief descriptions
4. Required parameters
5. Example responses

Format the output as a JSON object.`;

            const response = await openai.completions.create({
                model: "text-davinci-002",
                prompt: prompt,
                max_tokens: 1000,
                n: 1,
                stop: null,
                temperature: 0.5,
            });

            const unifiedDict = JSON.parse(response.choices[0].text.trim());
            setUnifiedDictionary(unifiedDict);
        } catch (error) {
            setError('Error generating unified dictionary: ' + error.message);
        }
        setLoading(false);
    };

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        switch(name) {
            case 'endpoint':
                setEndpoint(value);
                break;
            case 'method':
                setMethod(value);
                break;
            case 'requestBody':
                setRequestBody(value);
                break;
            default:
                break;
        }
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(endpoint, {
                method,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: method !== 'GET' ? JSON.stringify(JSON.parse(requestBody)) : null
            });

            const responseData = await response.json();
            setResponse(responseData);
        } catch (error) {
            setError(error.message);
        }
        setLoading(false);
    }

    return (
        <div className="api-tester">
            <h1>API Tester & Integrator</h1>
            {loading && <p>Loading...</p>}
            {error && <p className="error">{error}</p>}
            {apiSpecs.length > 0 && (
                <div>
                    <h2>API Specifications Loaded</h2>
                    <button onClick={generateUnifiedDictionary}>Generate Unified Dictionary</button>
                </div>
            )}
            {unifiedDictionary && (
                <div>
                    <h2>Unified API Dictionary</h2>
                    <pre>{JSON.stringify(unifiedDictionary, null, 2)}</pre>
                </div>
            )}
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Endpoint:</label>
                    <input
                        type="text"
                        name="endpoint"
                        value={endpoint}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div>
                    <label>Method:</label>
                    <select
                        name="method"
                        value={method}
                        onChange={handleInputChange}
                    >
                        <option value="GET">GET</option>
                        <option value="POST">POST</option>
                        <option value="PUT">PUT</option>
                        <option value="DELETE">DELETE</option>
                    </select>
                </div>
                {method !== 'GET' && (
                    <div>
                        <label>Request Body:</label>
                        <textarea
                            name="requestBody"
                            value={requestBody}
                            onChange={handleInputChange}
                        />
                    </div>
                )}
                <button type="submit" disabled={loading}>
                    {loading ? 'Loading...' : 'Send Request'}
                </button>
            </form>
            {response && (
                <div className="response">
                    <h2>Response</h2>
                    <pre>{JSON.stringify(response, null, 2)}</pre>
                </div>
            )}
        </div>
    );
};

export default APITester;
