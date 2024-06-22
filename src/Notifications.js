import React, { Component } from 'react';

class Notifications extends Component {
    constructor(props) {
        super(props);
        this.state = {
            notifications: [],
            loading: true,
            error: null
        };
    }

    componentDidMount() {
        this.fetchNotifications();
    }

    fetchNotifications() {
        // Simulate an API call to fetch notifications
        setTimeout(() => {
            this.setState({
                notifications: [
                    { id: 1, message: 'New shipment created', timestamp: '2023-10-01 10:00' },
                    { id: 2, message: 'Issue resolved', timestamp: '2023-10-01 11:00' },
                    { id: 3, message: 'API key updated', timestamp: '2023-10-01 12:00' }
                ],
                loading: false
            });
        }, 1000);
    }

    render() {
        const { notifications, loading, error } = this.state;

        if (loading) {
            return <div className="notifications">Loading notifications...</div>;
        }

        if (error) {
            return <div className="notifications">Error: {error.message}</div>;
        }

        return (
            <div className="notifications">
                <h1>Notifications</h1>
                <ul>
                    {notifications.map(notification => (
                        <li key={notification.id}>
                            <p>{notification.message}</p>
                            <span>{notification.timestamp}</span>
                        </li>
                    ))}
                </ul>
            </div>
        );
    }
}

export default Notifications;
