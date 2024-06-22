import React, { Component } from 'react';

class AskAI extends Component {
    constructor(props) {
        super(props);
        this.state = {
            query: '',
            response: '',
            loading: false,
            error: null
        };
    }

    handleInputChange = (event) => {
        this.setState({ query: event.target.value });
    }

    handleSubmit = async (event) => {
        event.preventDefault();
        this.setState({ loading: true, error: null });

        try {
            // Simulate an API call to get AI-powered suggestions
            const response = await this.fetchAISuggestions(this.state.query);
            this.setState({ response, loading: false });
        } catch (error) {
            this.setState({ error: 'Failed to fetch AI suggestions', loading: false });
        }
    }

    fetchAISuggestions = (query) => {
        // Simulate an API call with a delay
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (query) {
                    resolve(`AI-powered suggestion for: ${query}`);
                } else {
                    reject('No query provided');
                }
            }, 2000);
        });
    }

    render() {
        const { query, response, loading, error } = this.state;

        return (
            <div className="ask-ai">
                <h1>Ask AI</h1>
                <form onSubmit={this.handleSubmit}>
                    <input
                        type="text"
                        value={query}
                        onChange={this.handleInputChange}
                        placeholder="Enter your query"
                    />
                    <button type="submit" disabled={loading}>
                        {loading ? 'Loading...' : 'Ask AI'}
                    </button>
                </form>
                {error && <p className="error">{error}</p>}
                {response && <p className="response">{response}</p>}
            </div>
        );
    }
}

export default AskAI;
