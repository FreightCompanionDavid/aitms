import React, { Component } from 'react';

class LinkedAccounts extends Component {
    constructor(props) {
        super(props);
        this.state = {
            accounts: [],
            loading: true,
            error: null
        };
        this.ws = null;
    }

    componentDidMount() {
        this.fetchLinkedAccounts();
        this.connectWebSocket();
    }

    componentWillUnmount() {
        if (this.ws) {
            this.ws.close();
        }
    }

    connectWebSocket() {
        this.ws = new WebSocket('wss://api.freightbooks.com/ws/linked-accounts');

        this.ws.onmessage = (event) => {
            const updatedAccount = JSON.parse(event.data);
            this.setState(prevState => ({
                accounts: prevState.accounts.map(account =>
                    account.id === updatedAccount.id ? updatedAccount : account
                )
            }));
        };

        this.ws.onerror = (error) => {
            console.error('WebSocket error:', error);
            this.setState({ error: 'WebSocket connection error' });
        };
    }

    fetchLinkedAccounts() {
        // Simulate an API call to fetch linked accounts
        setTimeout(() => {
            this.setState({
                accounts: [
                    { id: 1, name: 'Account 1', status: 'Active' },
                    { id: 2, name: 'Account 2', status: 'Inactive' }
                ],
                loading: false
            });
        }, 1000);
    }

    render() {
        const { accounts, loading, error } = this.state;

        if (loading) {
            return <div className="linked-accounts">Loading...</div>;
        }

        if (error) {
            return <div className="linked-accounts">Error: {error}</div>;
        }

        return (
            <div className="linked-accounts">
                <h1>Linked Accounts</h1>
                <ul>
                    {accounts.map(account => (
                        <li key={account.id}>
                            {account.name} - {account.status}
                        </li>
                    ))}
                </ul>
            </div>
        );
    }
}

export default LinkedAccounts;
