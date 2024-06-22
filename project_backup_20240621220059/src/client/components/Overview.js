import React, { Component } from 'react';

class Overview extends Component {
    constructor(props) {
        super(props);
        this.state = {
            welcomeMessage: "Welcome to the FreightBooks Companion application!",
            keyFeatures: [
                "Discover and connect to freight forwarding APIs",
                "Design and execute automated workflows",
                "Visualize and analyze data from APIs",
                "Get AI-powered suggestions and insights",
                "Monitor and troubleshoot API integrations"
            ]
        };
    }

    render() {
        return (
            <div className="overview">
                <h1>{this.state.welcomeMessage}</h1>
                <h2>Key Features</h2>
                <ul>
                    {this.state.keyFeatures.map((feature, index) => (
                        <li key={index}>{feature}</li>
                    ))}
                </ul>
                <p>
                    FreightBooks Companion is a process, project, time, and knowledge management platform that provides amazing collaboration opportunities for developers and product teams alike.
                </p>
                <h2>Additional Features</h2>
                <ul>
                    <li>Keyboard shortcuts for efficient workflow</li>
                    <li>Team Planner to keep track of tasks in a centralized team calendar</li>
                    <li>Instant notifications to stay updated with any changes</li>
                </ul>
            </div>
        );
    }
}

export default Overview;
