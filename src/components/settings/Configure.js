import React, { Component } from 'react';

class Configure extends Component {
    constructor(props) {
        super(props);
        this.state = {
            settings: {
                apiEndpoint: '',
                apiKey: '',
                autoSync: false,
            },
            loading: true,
            error: null,
        };
    }

    componentDidMount() {
        this.fetchSettings();
    }

    fetchSettings() {
        // Simulate an API call to fetch settings
        setTimeout(() => {
            this.setState({
                settings: {
                    apiEndpoint: 'https://api.freightbooks.com',
                    apiKey: '12345-ABCDE',
                    autoSync: true,
                },
                loading: false,
            });
        }, 1000);
    }

    handleInputChange = (event) => {
        const { name, value, type, checked } = event.target;
        this.setState((prevState) => ({
            settings: {
                ...prevState.settings,
                [name]: type === 'checkbox' ? checked : value,
            },
        }));
    };

    handleSubmit = (event) => {
        event.preventDefault();
        // Simulate an API call to save settings
        console.log('Settings saved:', this.state.settings);
    };

    render() {
        const { settings, loading, error } = this.state;

        if (loading) {
            return <div>Loading...</div>;
        }

        if (error) {
            return <div>Error: {error.message}</div>;
        }

        return (
            <div className="configure">
                <h1>Configure Settings</h1>
                <form onSubmit={this.handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="apiEndpoint">API Endpoint</label>
                        <input
                            type="text"
                            id="apiEndpoint"
                            name="apiEndpoint"
                            value={settings.apiEndpoint}
                            onChange={this.handleInputChange}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="apiKey">API Key</label>
                        <input
                            type="text"
                            id="apiKey"
                            name="apiKey"
                            value={settings.apiKey}
                            onChange={this.handleInputChange}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="autoSync">Auto Sync</label>
                        <input
                            type="checkbox"
                            id="autoSync"
                            name="autoSync"
                            checked={settings.autoSync}
                            onChange={this.handleInputChange}
                        />
                    </div>
                    <button type="submit">Save Settings</button>
                </form>
            </div>
        );
    }
}

export default Configure;
