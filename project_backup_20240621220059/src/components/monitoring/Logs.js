import React, { Component } from 'react';

class Logs extends Component {
    constructor(props) {
        super(props);
        this.state = {
            logs: [],
            loading: true,
            error: null
        };
    }

    componentDidMount() {
        this.fetchLogs();
    }

    fetchLogs() {
        // Simulate an API call to fetch logs
        setTimeout(() => {
            this.setState({
                logs: [
                    { id: 1, message: 'Log entry 1', timestamp: '2023-10-01 10:00:00' },
                    { id: 2, message: 'Log entry 2', timestamp: '2023-10-01 11:00:00' },
                    { id: 3, message: 'Log entry 3', timestamp: '2023-10-01 12:00:00' }
                ],
                loading: false
            });
        }, 1000);
    }

    render() {
        const { logs, loading, error } = this.state;

        if (loading) {
            return <div className="logs">Loading logs...</div>;
        }

        if (error) {
            return <div className="logs">Error loading logs: {error}</div>;
        }

        return (
            <div className="logs">
                <h2>Logs</h2>
                <ul>
                    {logs.map(log => (
                        <li key={log.id}>
                            <strong>{log.timestamp}</strong>: {log.message}
                        </li>
                    ))}
                </ul>
            </div>
        );
    }
}

export default Logs;
