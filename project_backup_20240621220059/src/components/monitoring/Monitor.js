import React, { Component } from 'react';

class Monitor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            apiStatus: null,
            loading: true,
            error: null
        };
    }

    componentDidMount() {
        this.fetchApiStatus();
    }

    fetchApiStatus() {
        // Simulate an API call to fetch the status of API integrations
        setTimeout(() => {
            this.setState({
                apiStatus: {
                    integrations: [
                        { id: 1, name: 'API 1', status: 'Operational' },
                        { id: 2, name: 'API 2', status: 'Degraded' },
                        { id: 3, name: 'API 3', status: 'Down' }
                    ]
                },
                loading: false
            });
        }, 1000);
    }

    render() {
        const { apiStatus, loading, error } = this.state;

        if (loading) {
            return <div className="monitor">Loading...</div>;
        }

        if (error) {
            return <div className="monitor">Error: {error.message}</div>;
        }

        return (
            <div className="monitor">
                <h1>API Integrations Status</h1>
                <ul>
                    {apiStatus.integrations.map(integration => (
                        <li key={integration.id}>
                            {integration.name}: {integration.status}
                        </li>
                    ))}
                </ul>
            </div>
        );
    }
}

export default Monitor;
