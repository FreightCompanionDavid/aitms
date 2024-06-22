import React, { Component } from 'react';
import Chart from 'chart.js/auto';
import DateRangePicker from 'react-daterange-picker';
import { saveAs } from 'file-saver';
import { format } from 'date-fns';

class Visualize extends Component {
    constructor(props) {
        super(props);
        this.state = {
            apiData: null,
            loading: true,
            error: null,
            dateRange: {
                startDate: new Date(new Date().setMonth(new Date().getMonth() - 1)),
                endDate: new Date()
            },
            chartType: 'line'
        };
        this.chartRef = React.createRef();
        this.chart = null;
        this.ws = null;
    }

    componentDidMount() {
        this.fetchApiData();
        this.connectWebSocket();
    }

    componentWillUnmount() {
        if (this.ws) {
            this.ws.close();
        }
    }

    connectWebSocket() {
        this.ws = new WebSocket('wss://api.freightbooks.com/ws/visualize');
        this.ws.onmessage = (event) => {
            const newData = JSON.parse(event.data);
            this.setState(prevState => ({
                apiData: {
                    ...prevState.apiData,
                    shipments: [...prevState.apiData.shipments, newData.shipments],
                    issues: [...prevState.apiData.issues, newData.issues]
                }
            }), this.updateChart);
        };
    }

    fetchApiData = () => {
        this.setState({ loading: true, error: null });
        const { startDate, endDate } = this.state.dateRange;
        
        fetch(`https://api.freightbooks.com/visualize?start=${startDate.toISOString()}&end=${endDate.toISOString()}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                this.setState({ apiData: data, loading: false }, this.createChart);
            })
            .catch(error => {
                this.setState({ error: error.message, loading: false });
            });
    }

    createChart() {
        const { apiData, chartType } = this.state;
        if (apiData) {
            const ctx = this.chartRef.current.getContext('2d');
            this.chart = new Chart(ctx, {
                type: chartType,
                data: {
                    labels: apiData.labels,
                    datasets: [
                        {
                            label: 'Shipments',
                            data: apiData.shipments,
                            borderColor: 'rgba(75, 192, 192, 1)',
                            backgroundColor: 'rgba(75, 192, 192, 0.2)',
                            fill: true
                        },
                        {
                            label: 'Issues',
                            data: apiData.issues,
                            borderColor: 'rgba(255, 99, 132, 1)',
                            backgroundColor: 'rgba(255, 99, 132, 0.2)',
                            fill: true
                        }
                    ]
                },
                options: {
                    responsive: true,
                    scales: {
                        x: {
                            beginAtZero: true
                        },
                        y: {
                            beginAtZero: true
                        }
                    },
                    zoom: {
                        enabled: true,
                        mode: 'xy'
                    },
                    pan: {
                        enabled: true,
                        mode: 'xy'
                    },
                    plugins: {
                        datalabels: {
                            display: true
                        }
                    }
                }
            });
        }
    }

    updateChart() {
        if (this.chart) {
            this.chart.data.labels = this.state.apiData.labels;
            this.chart.data.datasets[0].data = this.state.apiData.shipments;
            this.chart.data.datasets[1].data = this.state.apiData.issues;
            this.chart.update();
        }
    }

    handleDateRangeChange = (dateRange) => {
        this.setState({ dateRange }, this.fetchApiData);
    }

    handleChartTypeChange = (event) => {
        this.setState({ chartType: event.target.value }, this.createChart);
    }

    handleExportData = () => {
        const { apiData } = this.state;
        const data = {
            labels: apiData.labels,
            shipments: apiData.shipments,
            issues: apiData.issues
        };
        const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
        saveAs(blob, 'data.json');
    }

    render() {
        const { loading, error, dateRange, chartType } = this.state;

        if (loading) {
            return <div>Loading...</div>;
        }

        if (error) {
            return <div>Error: {error.message}</div>;
        }

        return (
            <div className="visualize">
                <h1>Data Visualization</h1>
                <DateRangePicker
                    startDate={dateRange.startDate}
                    endDate={dateRange.endDate}
                    onChange={this.handleDateRangeChange}
                />
                <div>
                    <label>Chart Type:</label>
                    <select value={chartType} onChange={this.handleChartTypeChange}>
                        <option value="line">Line</option>
                        <option value="bar">Bar</option>
                        <option value="pie">Pie</option>
                    </select>
                </div>
                <button onClick={this.handleExportData}>Export Data</button>
                <canvas ref={this.chartRef}></canvas>
            </div>
        );
    }
}

export default Visualize;
