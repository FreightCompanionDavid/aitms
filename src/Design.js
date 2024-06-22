import React, { Component } from 'react';

class Design extends Component {
    constructor(props) {
        super(props);
        this.state = {
            workflows: [],
            newWorkflowName: ''
        };
    }

    handleInputChange = (event) => {
        this.setState({ newWorkflowName: event.target.value });
    }

    addWorkflow = () => {
        if (this.state.newWorkflowName.trim() !== '') {
            this.setState(prevState => ({
                workflows: [...prevState.workflows, this.state.newWorkflowName],
                newWorkflowName: ''
            }));
        }
    }

    render() {
        return (
            <div className="design">
                <h2>Design Automated Workflows</h2>
                <div className="workflow-input">
                    <input 
                        type="text" 
                        value={this.state.newWorkflowName} 
                        onChange={this.handleInputChange} 
                        placeholder="Enter workflow name" 
                    />
                    <button onClick={this.addWorkflow}>Add Workflow</button>
                </div>
                <div className="workflow-list">
                    <h3>Existing Workflows</h3>
                    <ul>
                        {this.state.workflows.map((workflow, index) => (
                            <li key={index}>{workflow}</li>
                        ))}
                    </ul>
                </div>
            </div>
        );
    }
}

export default Design;
