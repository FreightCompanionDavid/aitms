import React, { Component } from 'react';

class Resources extends Component {
    constructor(props) {
        super(props);
        this.state = {
            resources: [],
            loading: true,
            error: null
        };
    }

    componentDidMount() {
        this.fetchResources();
    }

    fetchResources() {
        // Simulate an API call to fetch resources
        setTimeout(() => {
            this.setState({
                resources: [
                    { id: 1, title: 'API Documentation', link: 'https://api.docs.freightbooks.com' },
                    { id: 2, title: 'Getting Started Guide', link: 'https://guides.freightbooks.com/getting-started' },
                    { id: 3, title: 'Support', link: 'https://support.freightbooks.com' }
                ],
                loading: false
            });
        }, 1000);
    }

    render() {
        const { resources, loading, error } = this.state;

        if (loading) {
            return <div className="resources">Loading resources...</div>;
        }

        if (error) {
            return <div className="resources">Error loading resources: {error.message}</div>;
        }

        return (
            <div className="resources">
                <h1>Resources</h1>
                <ul>
                    {resources.map(resource => (
                        <li key={resource.id}>
                            <a href={resource.link} target="_blank" rel="noopener noreferrer">
                                {resource.title}
                            </a>
                        </li>
                    ))}
                </ul>
            </div>
        );
    }
}

export default Resources;
