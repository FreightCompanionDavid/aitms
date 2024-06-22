import React, { Component } from 'react';
import WebSocket from 'websocket';

class Deploy extends Component {
    constructor(props) {
        super(props);
        this.state = {
            deploymentStatus: null,
            deploymentHistory: [],
            loading: true,
            error: null,
            progress: 0,
            ws: null,
            deploymentLogs: [],
            currentDeployment: null,
            isDeploying: false
        };
    }

    componentDidMount() {
        this.fetchDeploymentStatus();
        this.fetchDeploymentHistory();
        this.connectWebSocket();
        this.pollDeploymentStatus();
    }

    componentWillUnmount() {
        if (this.state.ws) {
            this.state.ws.close();
        }
        clearInterval(this.statusPollInterval);
    }

    connectWebSocket() {
        const ws = new WebSocket('wss://api.freightbooks.com/ws/deploy');
        ws.onopen = () => {
            console.log('WebSocket connected');
            this.setState({ wsConnected: true });
        };
        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            this.setState(prevState => ({
                deploymentStatus: data.status,
                progress: data.progress,
                deploymentLogs: [...prevState.deploymentLogs, data.log]
            }));
        };
        ws.onerror = (error) => {
            console.error('WebSocket error:', error);
            this.setState({ error: 'WebSocket connection error', wsConnected: false });
        };
        ws.onclose = () => {
            console.log('WebSocket disconnected');
            this.setState({ wsConnected: false });
            // Attempt to reconnect after a delay
            setTimeout(() => this.connectWebSocket(), 5000);
        };
        this.setState({ ws });
    }

    pollDeploymentStatus() {
        this.statusPollInterval = setInterval(() => {
            if (this.state.isDeploying) {
                this.fetchDeploymentStatus();
            }
        }, 5000); // Poll every 5 seconds
    }

    fetchDeploymentStatus() {
        fetch('https://api.freightbooks.com/deploy/status')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                this.setState({
                    deploymentStatus: data,
                    loading: false,
                    isDeploying: data.status === 'In Progress'
                });
            })
            .catch(error => {
                console.error('Error fetching deployment status:', error);
                this.setState({
                    error: 'Failed to fetch deployment status',
                    loading: false
                });
            });
    }

    fetchDeploymentHistory() {
        fetch('https://api.freightbooks.com/deploy/history')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                this.setState({
                    deploymentHistory: data
                });
            })
            .catch(error => {
                console.error('Failed to fetch deployment history:', error);
                this.setState({
                    error: 'Failed to fetch deployment history'
                });
            });
    }

    triggerDeployment = () => {
        this.setState({ loading: true, error: null, isDeploying: true });
        fetch('https://api.freightbooks.com/deploy', { 
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                version: this.state.currentDeployment
            })
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                this.setState({
                    deploymentStatus: data,
                    loading: false,
                    deploymentLogs: [{ timestamp: new Date().toISOString(), message: 'Deployment started' }]
                });
            })
            .catch(error => {
                console.error('Error triggering deployment:', error);
                this.setState({
                    error: 'Failed to trigger deployment',
                    loading: false,
                    isDeploying: false
                });
            });
    }

    retryDeployment = () => {
        this.setState({ error: null });
        this.triggerDeployment();
    }

    renderProgressBar() {
        return (
            <div className="progress-bar">
                <div className="progress" style={{ width: `${this.state.progress}%` }}></div>
            </div>
        );
    }

    handleVersionChange = (event) => {
        this.setState({ currentDeployment: event.target.value });
    }

    render() {
        const { deploymentStatus, deploymentHistory, loading, error, progress, deploymentLogs, currentDeployment, isDeploying } = this.state;

        if (loading) {
            return <div>Loading deployment status...</div>;
        }

        if (error) {
            return (
                <div>
                    <p>Error: {error}</p>
                    <button onClick={this.retryDeployment}>Retry</button>
                </div>
            );
        }

        return (
            <div className="deploy">
                <h2>Deployment Dashboard</h2>
                <p>Current Status: {deploymentStatus.status}</p>
                <p>Last Deployed: {deploymentStatus.lastDeployed}</p>
                {this.renderProgressBar()}
                
                <select value={currentDeployment} onChange={this.handleVersionChange}>
                    <option value="">Select version to deploy</option>
                    {deploymentHistory.map(deploy => (
                        <option key={deploy.id} value={deploy.version}>
                            {deploy.version} - {new Date(deploy.timestamp).toLocaleString()}
                        </option>
                    ))}
                </select>
                
                <button 
                    onClick={this.triggerDeployment} 
                    disabled={isDeploying || !currentDeployment}
                >
                    {isDeploying ? 'Deploying...' : 'Trigger Deployment'}
                </button>
                
                <h3>Deployment Logs</h3>
                <ul>
                    {deploymentLogs.map((log, index) => (
                        <li key={index}>
                            {new Date(log.timestamp).toLocaleString()} - {log.message}
                        </li>
                    ))}
                </ul>
                
                <h3>Deployment History</h3>
                <ul>
                    {deploymentHistory.map(deploy => (
                        <li key={deploy.id}>
                            {new Date(deploy.timestamp).toLocaleString()} - Version: {deploy.version} - Status: {deploy.status}
                        </li>
                    ))}
                </ul>
            </div>
        );
    }
}

export default Deploy;
