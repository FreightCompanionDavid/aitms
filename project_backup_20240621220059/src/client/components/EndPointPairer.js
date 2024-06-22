import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const APIEndpointPairingTool = () => {
    const [endpoints, setEndpoints] = useState([]);
    const [pairedEndpoints, setPairedEndpoints] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchEndpoints();
    }, []);

    const fetchEndpoints = async () => {
        try {
            const response = await fetch('https://api.freightbooks.com/endpoints');
            if (!response.ok) throw new Error('Failed to fetch endpoints');
            const data = await response.json();
            setEndpoints(data);
            setLoading(false);
        } catch (err) {
            setError(err.message);
            setLoading(false);
        }
    };

    const onDragEnd = (result) => {
        if (!result.destination) return;

        const { source, destination } = result;

        if (source.droppableId === destination.droppableId) {
            // Reordering within the same list
            const items = reorder(
                source.droppableId === 'endpoints' ? endpoints : pairedEndpoints,
                source.index,
                destination.index
            );

            if (source.droppableId === 'endpoints') {
                setEndpoints(items);
            } else {
                setPairedEndpoints(items);
            }
        } else {
            // Moving between lists
            const result = move(
                source.droppableId === 'endpoints' ? endpoints : pairedEndpoints,
                source.droppableId === 'endpoints' ? pairedEndpoints : endpoints,
                source,
                destination
            );

            setEndpoints(result.endpoints);
            setPairedEndpoints(result.pairedEndpoints);
        }
    };

    const reorder = (list, startIndex, endIndex) => {
        const result = Array.from(list);
        const [removed] = result.splice(startIndex, 1);
        result.splice(endIndex, 0, removed);
        return result;
    };

    const move = (source, destination, droppableSource, droppableDestination) => {
        const sourceClone = Array.from(source);
        const destClone = Array.from(destination);
        const [removed] = sourceClone.splice(droppableSource.index, 1);

        destClone.splice(droppableDestination.index, 0, removed);

        const result = {};
        result[droppableSource.droppableId] = sourceClone;
        result[droppableDestination.droppableId] = destClone;

        return result;
    };

    if (loading) return <div>Loading endpoints like a freight train...</div>;
    if (error) return <div>Error: {error} - We've hit a roadblock, but we're not giving up!</div>;

    return (
        <div className="api-endpoint-pairing-tool">
            <h1>🔥 Extreme API Endpoint Pairing Tool 🚀</h1>
            <DragDropContext onDragEnd={onDragEnd}>
                <div className="endpoint-lists">
                    <Droppable droppableId="endpoints">
                        {(provided) => (
                            <div ref={provided.innerRef} {...provided.droppableProps}>
                                <h2>Available Endpoints</h2>
                                {endpoints.map((endpoint, index) => (
                                    <Draggable key={endpoint.id} draggableId={endpoint.id} index={index}>
                                        {(provided) => (
                                            <div
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps}
                                                className="endpoint-item"
                                            >
                                                {endpoint.name}
                                            </div>
                                        )}
                                    </Draggable>
                                ))}
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                    <Droppable droppableId="pairedEndpoints">
                        {(provided) => (
                            <div ref={provided.innerRef} {...provided.droppableProps}>
                                <h2>Paired Endpoints</h2>
                                {pairedEndpoints.map((endpoint, index) => (
                                    <Draggable key={endpoint.id} draggableId={endpoint.id} index={index}>
                                        {(provided) => (
                                            <div
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps}
                                                className="endpoint-item paired"
                                            >
                                                {endpoint.name}
                                            </div>
                                        )}
                                    </Draggable>
                                ))}
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                </div>
            </DragDropContext>
            <button onClick={() => console.log('Paired Endpoints:', pairedEndpoints)} className="save-button">
                Save Extreme Pairings! 🔥
            </button>
        </div>
    );
};

export default APIEndpointPairingTool;
