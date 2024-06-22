import React, { Component } from 'react';

class Dashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            apiData: null,
            loading: true,
            error: null
        };
    }

    componentDidMount() {
        this.fetchApiData();
    }

    fetchApiData() {
        // Simulate an API call
        setTimeout(() => {
            this.setState({
                apiData: {
                    totalShipments: 120,
                    pendingIssues: 5,
                    recentLogs: [
                        { id: 1, message: 'Shipment 1234 created', timestamp: '2023-10-01 10:00' },
                        { id: 2, message: 'Issue 5678 resolved', timestamp: '2023-10-01 11:00' }
                    ]
                },
                loading: false
            });
        }, 1000);
    }

    render() {
        const { apiData, loading, error } = this.state;

        if (loading) {
            return <div>Loading...</div>;
        }

        if (error) {
            return <div>Error: {error.message}</div>;
        }

        return (
            <div className="dashboard">
                <h1>Dashboard</h1>
                <div className="dashboard-stats">
                    <div className="stat">
                        <h2>Total Shipments</h2>
                        <p>{apiData.totalShipments}</p>
                    </div>
                    <div className="stat">
                        <h2>Pending Issues</h2>
                        <p>{apiData.pendingIssues}</p>
                    </div>
                </div>
                <div className="dashboard-logs">
                    <h2>Recent Logs</h2>
                    <ul>
                        {apiData.recentLogs.map(log => (
                            <li key={log.id}>
                                {log.message} - <span>{log.timestamp}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        );
    }
}

export default Dashboard;
