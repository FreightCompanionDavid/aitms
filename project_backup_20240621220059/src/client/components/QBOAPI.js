import React, { Component } from 'react';

class QBOAPI extends Component {
    constructor(props) {
        super(props);
        this.state = {
            qboData: null,
            loading: true,
            error: null
        };
    }

    componentDidMount() {
        this.fetchQBOData();
    }

    fetchQBOData() {
        // Simulate an API call to fetch QBO data
        setTimeout(() => {
            this.setState({
                qboData: {
                    invoices: [
                        { id: 1, customer: 'Customer A', amount: 1000, status: 'Paid' },
                        { id: 2, customer: 'Customer B', amount: 2000, status: 'Unpaid' }
                    ],
                    expenses: [
                        { id: 1, vendor: 'Vendor A', amount: 500, category: 'Office Supplies' },
                        { id: 2, vendor: 'Vendor B', amount: 1500, category: 'Travel' }
                    ]
                },
                loading: false
            });
        }, 1000);
    }

    render() {
        const { qboData, loading, error } = this.state;

        if (loading) {
            return <div className="qbo-api">Loading QBO data...</div>;
        }

        if (error) {
            return <div className="qbo-api">Error: {error.message}</div>;
        }

        return (
            <div className="qbo-api">
                <h1>QBO API Data</h1>
                <div className="qbo-invoices">
                    <h2>Invoices</h2>
                    <ul>
                        {qboData.invoices.map(invoice => (
                            <li key={invoice.id}>
                                {invoice.customer} - ${invoice.amount} - {invoice.status}
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="qbo-expenses">
                    <h2>Expenses</h2>
                    <ul>
                        {qboData.expenses.map(expense => (
                            <li key={expense.id}>
                                {expense.vendor} - ${expense.amount} - {expense.category}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        );
    }
}

export default QBOAPI;
