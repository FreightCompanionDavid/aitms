import React, { Component } from 'react';

class Advanced extends Component {
    constructor(props) {
        super(props);
        this.state = {
            advancedSettings: [],
            loading: true,
            error: null
        };
    }

    componentDidMount() {
        this.fetchAdvancedSettings();
    }

    fetchAdvancedSettings() {
        // Simulate an API call to fetch advanced settings
        setTimeout(() => {
            this.setState({
                advancedSettings: [
                    { id: 1, name: 'Enable Debug Mode', enabled: false },
                    { id: 2, name: 'API Rate Limiting', enabled: true },
                    { id: 3, name: 'Custom Webhooks', enabled: false }
                ],
                loading: false
            });
        }, 1000);
    }

    toggleSetting(id) {
        this.setState(prevState => ({
            advancedSettings: prevState.advancedSettings.map(setting =>
                setting.id === id ? { ...setting, enabled: !setting.enabled } : setting
            )
        }));
    }

    render() {
        const { advancedSettings, loading, error } = this.state;

        if (loading) {
            return <div>Loading...</div>;
        }

        if (error) {
            return <div>Error: {error.message}</div>;
        }

        return (
            <div className="advanced">
                <h1>Advanced Settings</h1>
                <ul>
                    {advancedSettings.map(setting => (
                        <li key={setting.id}>
                            <label>
                                <input
                                    type="checkbox"
                                    checked={setting.enabled}
                                    onChange={() => this.toggleSetting(setting.id)}
                                />
                                {setting.name}
                            </label>
                        </li>
                    ))}
                </ul>
            </div>
        );
    }
}

export default Advanced;
