import React, { Component } from 'react';

class Issues extends Component {
    constructor(props) {
        super(props);
        this.state = {
            issues: [],
            loading: true,
            error: null
        };
    }

    componentDidMount() {
        this.fetchIssues();
    }

    fetchIssues() {
        // Simulate an API call to fetch issues
        setTimeout(() => {
            this.setState({
                issues: [
                    { id: 1, title: 'API Integration Issue', status: 'Open', description: 'Problem with API response time.' },
                    { id: 2, title: 'Data Mismatch', status: 'Closed', description: 'Data mismatch between systems.' },
                    { id: 3, title: 'Authentication Error', status: 'In Progress', description: 'Error during user authentication.' }
                ],
                loading: false,
                error: null
            });
        }, 1000);
    }

    renderIssues() {
        const { issues } = this.state;
        return issues.map(issue => (
            <div key={issue.id} className="issue">
                <h3>{issue.title}</h3>
                <p>Status: {issue.status}</p>
                <p>{issue.description}</p>
            </div>
        ));
    }

    render() {
        const { loading, error } = this.state;

        if (loading) {
            return <div>Loading issues...</div>;
        }

        if (error) {
            return <div>Error loading issues: {error}</div>;
        }

        return (
            <div className="issues">
                <h2>Issues</h2>
                {this.renderIssues()}
            </div>
        );
    }
}

export default Issues;
