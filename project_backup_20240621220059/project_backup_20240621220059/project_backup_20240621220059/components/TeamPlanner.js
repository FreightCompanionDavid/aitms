import React, { Component } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

class TeamPlanner extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tasks: [],
            loading: true,
            error: null,
            filter: 'all',
            sortBy: 'dueDate',
            retryCount: 0,
            lastUpdated: null
        };
        this.ws = null;
        this.retryInterval = null;
    }

    componentDidMount() {
        this.fetchTasks();
        this.connectWebSocket();
        this.startAutoRefresh();
    }

    componentWillUnmount() {
        this.cleanupResources();
    }

    cleanupResources() {
        if (this.ws) {
            this.ws.close();
        }
        if (this.retryInterval) {
            clearInterval(this.retryInterval);
        }
    }

    startAutoRefresh() {
        // Auto-refresh tasks every 5 minutes
        this.refreshInterval = setInterval(() => this.fetchTasks(), 300000);
    }

    connectWebSocket() {
        this.ws = new WebSocket('wss://api.freightbooks.com/ws/team-planner');
        this.ws.onmessage = this.handleWebSocketMessage;
        this.ws.onerror = this.handleWebSocketError;
        this.ws.onclose = this.handleWebSocketClose;
    }

    handleWebSocketMessage = (event) => {
        const updatedTask = JSON.parse(event.data);
        this.setState(prevState => ({
            tasks: prevState.tasks.map(task =>
                task.id === updatedTask.id ? { ...task, ...updatedTask } : task
            ),
            lastUpdated: new Date()
        }));
    }

    handleWebSocketError = (error) => {
        console.error('WebSocket error:', error);
        this.setState({ error: 'WebSocket connection error' });
        this.attemptReconnect();
    }

    handleWebSocketClose = () => {
        console.log('WebSocket connection closed');
        this.attemptReconnect();
    }

    attemptReconnect() {
        if (this.state.retryCount < 5) {
            setTimeout(() => {
                this.setState(prevState => ({ retryCount: prevState.retryCount + 1 }));
                this.connectWebSocket();
            }, 5000);
        } else {
            this.setState({ error: 'Failed to reconnect to WebSocket after multiple attempts' });
        }
    }

    fetchTasks() {
        fetch('https://api.freightbooks.com/tasks')
            .then(this.handleResponse)
            .then(this.handleData)
            .catch(this.handleError);
    }

    handleResponse = (response) => {
        if (!response.ok) {
            throw new Error('Failed to fetch tasks');
        }
        return response.json();
    }

    handleData = (data) => {
        this.setState({ 
            tasks: data, 
            loading: false, 
            error: null, 
            retryCount: 0,
            lastUpdated: new Date()
        });
    }

    handleError = (error) => {
        this.setState({ error: error.message, loading: false });
        if (this.state.retryCount < 3) {
            this.retryFetch();
        } else {
            this.setState({ error: 'Failed to fetch tasks after multiple attempts' });
        }
    }

    retryFetch() {
        this.setState(prevState => ({ retryCount: prevState.retryCount + 1 }));
        setTimeout(() => this.fetchTasks(), 5000);
    }

    // ... rest of the component methods ...

    render() {
        const { loading, error, lastUpdated } = this.state;

        if (loading) {
            return <div>Loading tasks like a freight train on steroids! 🚂💨</div>;
        }

        if (error) {
            return <div>Error: {error} - We've hit a roadblock, but we're bulldozing through! 🚧🏗️</div>;
        }

        return (
            <div className="team-planner">
                <h1>🔥 Extreme Team Planner 3000 🚀</h1>
                {lastUpdated && <p>Last updated: {lastUpdated.toLocaleString()}</p>}
                {/* ... rest of the render method ... */}
            </div>
        );
    }
}

export default TeamPlanner;
