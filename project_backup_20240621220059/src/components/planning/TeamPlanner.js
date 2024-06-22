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
            sortBy: 'dueDate'
        };
        this.ws = null;
    }

    componentDidMount() {
        this.fetchTasks();
        this.connectWebSocket();
    }

    componentWillUnmount() {
        if (this.ws) {
            this.ws.close();
        }
    }

    connectWebSocket() {
        this.ws = new WebSocket('wss://api.freightbooks.com/ws/team-planner');
        this.ws.onmessage = (event) => {
            const updatedTask = JSON.parse(event.data);
            this.setState(prevState => ({
                tasks: prevState.tasks.map(task =>
                    task.id === updatedTask.id ? updatedTask : task
                )
            }));
        };
        this.ws.onerror = (error) => {
            console.error('WebSocket error:', error);
            this.setState({ error: 'WebSocket connection error' });
        };
    }

    fetchTasks() {
        fetch('https://api.freightbooks.com/tasks')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to fetch tasks');
                }
                return response.json();
            })
            .then(data => {
                this.setState({ tasks: data, loading: false });
            })
            .catch(error => {
                this.setState({ error: error.message, loading: false });
                setTimeout(() => this.fetchTasks(), 5000); // Retry after 5 seconds
            });
    }

    handleDragEnd = (result) => {
        if (!result.destination) return;

        const tasks = Array.from(this.state.tasks);
        const [reorderedTask] = tasks.splice(result.source.index, 1);
        tasks.splice(result.destination.index, 0, reorderedTask);

        this.setState({ tasks });
        this.updateTaskAssignment(reorderedTask.id, tasks[result.destination.index].assignedTo);
    }

    updateTaskAssignment(taskId, newAssignee) {
        fetch(`https://api.freightbooks.com/tasks/${taskId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ assignedTo: newAssignee })
        }).catch(error => console.error('Error updating task assignment:', error));
    }

    handleFilterChange = (event) => {
        this.setState({ filter: event.target.value });
    }

    handleSortChange = (event) => {
        this.setState({ sortBy: event.target.value });
    }

    toggleTaskCompletion = (taskId) => {
        this.setState(prevState => ({
            tasks: prevState.tasks.map(task =>
                task.id === taskId ? { ...task, completed: !task.completed } : task
            )
        }));
    }

    renderTasks() {
        let filteredTasks = this.state.tasks;

        if (this.state.filter !== 'all') {
            filteredTasks = filteredTasks.filter(task => task.priority === this.state.filter);
        }

        filteredTasks.sort((a, b) => {
            if (this.state.sortBy === 'dueDate') {
                return new Date(a.dueDate) - new Date(b.dueDate);
            } else {
                return a.priority.localeCompare(b.priority);
            }
        });

        return (
            <DragDropContext onDragEnd={this.handleDragEnd}>
                <Droppable droppableId="tasks">
                    {(provided) => (
                        <tbody {...provided.droppableProps} ref={provided.innerRef}>
                            {filteredTasks.map((task, index) => (
                                <Draggable key={task.id} draggableId={task.id.toString()} index={index}>
                                    {(provided) => (
                                        <tr
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                        >
                                            <td>
                                                <input
                                                    type="checkbox"
                                                    checked={task.completed}
                                                    onChange={() => this.toggleTaskCompletion(task.id)}
                                                />
                                            </td>
                                            <td>{task.name}</td>
                                            <td>{task.dueDate}</td>
                                            <td>{task.assignedTo}</td>
                                            <td>{task.priority}</td>
                                        </tr>
                                    )}
                                </Draggable>
                            ))}
                            {provided.placeholder}
                        </tbody>
                    )}
                </Droppable>
            </DragDropContext>
        );
    }

    render() {
        const { loading, error } = this.state;

        if (loading) {
            return <div>Loading tasks like a freight train...</div>;
        }

        if (error) {
            return <div>Error: {error} - We've hit a roadblock, but we're not giving up!</div>;
        }

        return (
            <div className="team-planner">
                <h1>🔥 Extreme Team Planner 🚀</h1>
                <div className="controls">
                    <select onChange={this.handleFilterChange}>
                        <option value="all">All Priorities</option>
                        <option value="high">High Priority</option>
                        <option value="medium">Medium Priority</option>
                        <option value="low">Low Priority</option>
                    </select>
                    <select onChange={this.handleSortChange}>
                        <option value="dueDate">Sort by Due Date</option>
                        <option value="priority">Sort by Priority</option>
                    </select>
                </div>
                <table>
                    <thead>
                        <tr>
                            <th>Status</th>
                            <th>Task</th>
                            <th>Due Date</th>
                            <th>Assigned To</th>
                            <th>Priority</th>
                        </tr>
                    </thead>
                    {this.renderTasks()}
                </table>
            </div>
        );
    }
}

export default TeamPlanner;
