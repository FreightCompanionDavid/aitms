import React, { Component } from 'react';

class Test extends Component {
    constructor(props) {
        super(props);
        this.state = {
            testCases: [],
            loading: true,
            error: null
        };
    }

    componentDidMount() {
        this.fetchTestCases();
    }

    fetchTestCases() {
        // Simulate an API call to fetch test cases
        setTimeout(() => {
            this.setState({
                testCases: [
                    { id: 1, name: 'Test Case 1', status: 'Passed', lastRun: '2023-10-01 10:00' },
                    { id: 2, name: 'Test Case 2', status: 'Failed', lastRun: '2023-10-01 11:00' }
                ],
                loading: false
            });
        }, 1000);
    }

    render() {
        const { testCases, loading, error } = this.state;

        if (loading) {
            return <div>Loading test cases...</div>;
        }

        if (error) {
            return <div>Error loading test cases: {error.message}</div>;
        }

        return (
            <div className="test">
                <h2>Test Cases</h2>
                <ul>
                    {testCases.map(testCase => (
                        <li key={testCase.id}>
                            <strong>{testCase.name}</strong> - Status: {testCase.status} - Last Run: {testCase.lastRun}
                        </li>
                    ))}
                </ul>
            </div>
        );
    }
}

export default Test;
