import React, { Component } from 'react';

class APIKeys extends Component {
    constructor(props) {
        super(props);
        this.state = {
            apiKeys: [],
            loading: true,
            error: null
        };
    }

    componentDidMount() {
        this.fetchApiKeys();
    }

    fetchApiKeys() {
        // Simulate an API call to fetch API keys
        setTimeout(() => {
            this.setState({
                apiKeys: [
                    { id: 1, name: 'Primary API Key', key: 'abcd1234', created: '2023-01-01' },
                    { id: 2, name: 'Secondary API Key', key: 'efgh5678', created: '2023-02-01' }
                ],
                loading: false
            });
        }, 1000);
    }

    render() {
        const { apiKeys, loading, error } = this.state;

        if (loading) {
            return <div className="api-keys">Loading API keys...</div>;
        }

        if (error) {
            return <div className="api-keys">Error: {error.message}</div>;
        }

        return (
            <div className="api-keys">
                <h1>API Keys</h1>
                <ul>
                    {apiKeys.map(apiKey => (
                        <li key={apiKey.id}>
                            <strong>{apiKey.name}</strong> - {apiKey.key} (Created: {apiKey.created})
                        </li>
                    ))}
                </ul>
            </div>
        );
    }
}

export default APIKeys;
