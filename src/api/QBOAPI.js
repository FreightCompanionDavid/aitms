import React, { useState, useEffect } from 'react';
import axios from 'axios';

const QBOAPI = () => {
    const [freightData, setFreightData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchFreightData();
    }, []);

    const fetchFreightData = async () => {
        try {
            const response = await axios.get('/api/freight-data');
            setFreightData(response.data);
            setLoading(false);
        } catch (error) {
            setError('Error fetching freight data: ' + error.message);
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="freight-api">Loading freight data...</div>;
    }

    if (error) {
        return <div className="freight-api">Error: {error}</div>;
    }

    return (
        <div className="freight-api">
            <h1>Freight Forwarding Data</h1>
            <div className="freight-shipments">
                <h2>Shipments</h2>
                <ul>
                    {freightData.shipments.map(shipment => (
                        <li key={shipment.id}>
                            {shipment.trackingNumber} - {shipment.status} - {shipment.destination}
                        </li>
                    ))}
                </ul>
            </div>
            <div className="freight-customs">
                <h2>Customs Declarations</h2>
                <ul>
                    {freightData.customsDeclarations.map(declaration => (
                        <li key={declaration.id}>
                            {declaration.declarationNumber} - {declaration.status} - {declaration.value}
                        </li>
                    ))}
                </ul>
            </div>
            <div className="freight-invoices">
                <h2>Invoices</h2>
                <ul>
                    {freightData.invoices.map(invoice => (
                        <li key={invoice.id}>
                            {invoice.invoiceNumber} - ${invoice.amount} - {invoice.dueDate}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default QBOAPI;
