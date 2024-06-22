import React, { Component } from 'react';

class Scopes extends Component {
    constructor(props) {
        super(props);
        this.state = {
            scopes: [],
            loading: true,
            error: null
        };
    }

    componentDidMount() {
        this.fetchScopes();
    }

    fetchScopes() {
        // Simulate an API call to fetch scopes
        setTimeout(() => {
            this.setState({
                scopes: [
                    { id: 1, name: 'Read Access', description: 'Allows read access to data' },
                    { id: 2, name: 'Write Access', description: 'Allows write access to data' },
                    { id: 3, name: 'Admin Access', description: 'Allows full access to data' }
                ],
                loading: false,
                error: null
            });
        }, 1000);
    }

    render() {
        const { scopes, loading, error } = this.state;

        if (loading) {
            return <div>Loading...</div>;
        }

        if (error) {
            return <div>Error: {error.message}</div>;
        }

        return (
            <div className="scopes">
                <h1>Scopes</h1>
                <ul>
                    {scopes.map(scope => (
                        <li key={scope.id}>
                            <h2>{scope.name}</h2>
                            <p>{scope.description}</p>
                        </li>
                    ))}
                </ul>
            </div>
        );
    }
}

export default Scopes;
