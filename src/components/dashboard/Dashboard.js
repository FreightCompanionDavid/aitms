import React, { useState, useEffect, useCallback, useMemo, Suspense } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area, ScatterChart, Scatter, ResponsiveContainer } from 'recharts';
import './Dashboard.css';
import AIAssistant from '../AIAssistant/AIAssistant';
import { useQuery, useQueryClient } from 'react-query';
import { debounce } from 'lodash';
import { motion, AnimatePresence } from 'framer-motion';
import { ErrorBoundary } from 'react-error-boundary';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001';

const fetchData = async (endpoint) => {
  const response = await axios.get(`${API_BASE_URL}${endpoint}`);
  return response.data;
};

const Dashboard = () => {
    const [selectedDataPoint, setSelectedDataPoint] = useState(null);
    const [showAIAssistant, setShowAIAssistant] = useState(false);
    const [aiMessage, setAIMessage] = useState('');
    const [activeView, setActiveView] = useState('overview');
    const queryClient = useQueryClient();

    const { data: dashboardData, isLoading: isDashboardLoading, error: dashboardError } = useQuery('dashboardData', () => fetchData('/api/freight-dashboard'), {
        staleTime: 5 * 60 * 1000, // 5 minutes
        refetchInterval: 5 * 60 * 1000, // 5 minutes
    });
    const { data: kpis } = useQuery('kpis', () => fetchData('/api/kpis'), { staleTime: Infinity });
    const { data: marketTrends } = useQuery('marketTrends', () => fetchData('/api/market-trends'), { staleTime: Infinity });
    const { data: competitorAnalysis } = useQuery('competitorAnalysis', () => fetchData('/api/competitor-analysis'), { staleTime: Infinity });
    const { data: financialOverview } = useQuery('financialOverview', () => fetchData('/api/financial-overview'), { staleTime: Infinity });

    const { data: drillDownData, refetch: refetchDrillDown } = useQuery(
        ['drillDownData', selectedDataPoint],
        () => fetchData(`/api/freight-dashboard/drill-down?date=${selectedDataPoint.date}`),
        { enabled: !!selectedDataPoint }
    );

    const debouncedFetchDrillDown = useCallback(
        debounce((dataPoint) => {
            setSelectedDataPoint(dataPoint);
        }, 300),
        []
    );

    const handleDataPointClick = useCallback((data) => {
        debouncedFetchDrillDown(data);
    }, [debouncedFetchDrillDown]);

    const toggleAIAssistant = useCallback(() => {
        setShowAIAssistant(prev => !prev);
    }, []);

    const handleAIMessage = useCallback(async (message) => {
        try {
            const response = await axios.post(`${API_BASE_URL}/api/ai-assistant`, { message, context: dashboardData });
            setAIMessage(response.data.message);
        } catch (err) {
            console.error('Failed to get AI response', err);
            setAIMessage('Sorry, I encountered an error while processing your request.');
        }
    }, [dashboardData]);

    const COLORS = useMemo(() => ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'], []);

    const renderActiveView = useCallback(() => {
        switch(activeView) {
            case 'overview':
                return (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="dashboard-stats">
                            <StatCard title="Total Revenue" value={`$${financialOverview?.totalRevenue}`} />
                            <StatCard title="Net Profit" value={`$${financialOverview?.netProfit}`} />
                            <StatCard title="Market Share" value={`${financialOverview?.marketShare}%`} />
                            <StatCard title="Customer Retention Rate" value={`${kpis?.customerRetentionRate}%`} />
                        </div>
                        <div className="dashboard-chart">
                            <h2>Revenue Trend</h2>
                            <ResponsiveContainer width="100%" height={300}>
                                <LineChart data={dashboardData?.revenueData} onClick={handleDataPointClick}>
                                    <XAxis dataKey="date" />
                                    <YAxis />
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <Tooltip />
                                    <Legend />
                                    <Line type="monotone" dataKey="revenue" stroke="#8884d8" />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </motion.div>
                );
            case 'marketAnalysis':
                return (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="dashboard-chart">
                            <h2>Market Trends</h2>
                            <ResponsiveContainer width="100%" height={300}>
                                <LineChart data={marketTrends}>
                                    <XAxis dataKey="date" />
                                    <YAxis />
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <Tooltip />
                                    <Legend />
                                    <Line type="monotone" dataKey="industryGrowth" stroke="#8884d8" />
                                    <Line type="monotone" dataKey="companyGrowth" stroke="#82ca9d" />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="dashboard-chart">
                            <h2>Competitor Analysis</h2>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={competitorAnalysis}>
                                    <XAxis dataKey="competitor" />
                                    <YAxis />
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="marketShare" fill="#8884d8" />
                                    <Bar dataKey="revenue" fill="#82ca9d" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </motion.div>
                );
            case 'operationalEfficiency':
                return (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="dashboard-chart">
                            <h2>Operational Efficiency</h2>
                            <ResponsiveContainer width="100%" height={300}>
                                <AreaChart data={kpis?.operationalEfficiency}>
                                    <XAxis dataKey="date" />
                                    <YAxis />
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <Tooltip />
                                    <Area type="monotone" dataKey="efficiency" stroke="#8884d8" fill="#8884d8" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="dashboard-chart">
                            <h2>Cost Breakdown</h2>
                            <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <Pie
                                        data={financialOverview?.costBreakdown}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        outerRadius={80}
                                        fill="#8884d8"
                                        dataKey="value"
                                    >
                                        {financialOverview?.costBreakdown.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </motion.div>
                );
            default:
                return null;
        }
    }, [activeView, financialOverview, kpis, dashboardData, marketTrends, competitorAnalysis, handleDataPointClick, COLORS]);

    useEffect(() => {
        const interval = setInterval(() => {
            queryClient.invalidateQueries('dashboardData');
        }, 5 * 60 * 1000); // 5 minutes

        return () => clearInterval(interval);
    }, [queryClient]);

    if (isDashboardLoading) return <div className="loading">Loading...</div>;
    if (dashboardError) return <div className="error">{dashboardError.message}</div>;
    if (!dashboardData) return null;

    return (
        <ErrorBoundary FallbackComponent={ErrorFallback}>
            <div className="dashboard">
                <h1>CEO Dashboard - Freight Forwarding Company</h1>
                <div className="view-selector">
                    <button onClick={() => setActiveView('overview')} className={activeView === 'overview' ? 'active' : ''}>Financial Overview</button>
                    <button onClick={() => setActiveView('marketAnalysis')} className={activeView === 'marketAnalysis' ? 'active' : ''}>Market Analysis</button>
                    <button onClick={() => setActiveView('operationalEfficiency')} className={activeView === 'operationalEfficiency' ? 'active' : ''}>Operational Efficiency</button>
                </div>
                <AnimatePresence mode="wait">
                    {renderActiveView()}
                </AnimatePresence>
                {selectedDataPoint && drillDownData && (
                    <motion.div 
                        className="drill-down"
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 50 }}
                    >
                        <h3>Drill Down for {selectedDataPoint.date}</h3>
                        <p>Total Revenue: ${drillDownData.totalRevenue}</p>
                        <p>Number of Shipments: {drillDownData.shipmentCount}</p>
                        <p>Average Revenue per Shipment: ${drillDownData.averageRevenue}</p>
                    </motion.div>
                )}
                <div className="dashboard-actions">
                    <h2>Strategic Actions</h2>
                    <button onClick={() => console.log('View detailed financial reports')}>View Detailed Financial Reports</button>
                    <button onClick={() => console.log('Schedule board meeting')}>Schedule Board Meeting</button>
                    <button onClick={() => console.log('Review expansion opportunities')}>Review Expansion Opportunities</button>
                    <button onClick={toggleAIAssistant}>
                        {showAIAssistant ? 'Hide AI Assistant' : 'Show AI Assistant'}
                    </button>
                </div>
                <AnimatePresence>
                    {showAIAssistant && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 20 }}
                        >
                            <Suspense fallback={<div>Loading AI Assistant...</div>}>
                                <AIAssistant
                                    onSendMessage={handleAIMessage}
                                    aiMessage={aiMessage}
                                />
                            </Suspense>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </ErrorBoundary>
    );
};

const StatCard = React.memo(({ title, value }) => (
    <motion.div 
        className="stat-card"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
    >
        <h3>{title}</h3>
        <p>{value}</p>
    </motion.div>
));

const ErrorFallback = ({ error }) => (
    <div className="error-fallback">
        <h2>Oops! Something went wrong.</h2>
        <p>Error: {error.message}</p>
        <button onClick={() => window.location.reload()}>Refresh Page</button>
    </div>
);
const Dashboard = () => {
    // ... existing code ...

    return (
        <ErrorBoundary FallbackComponent={ErrorFallback}>
            <div className="dashboard">
                <h1>Executive Dashboard</h1>
                {isDashboardLoading ? (
                    <div>Loading dashboard data...</div>
                ) : dashboardError ? (
                    <div>Error loading dashboard: {dashboardError.message}</div>
                ) : (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="dashboard-summary">
                            {displaySummaryCards(dashboardData.summary)}
                        </div>
                        <div className="recent-shipments">
                            <h2>Recent Shipments</h2>
                            {displayRecentShipments(dashboardData.recentShipments)}
                        </div>
                        <div className="performance-metrics">
                            <h2>Performance Metrics</h2>
                            {displayPerformanceMetrics(dashboardData.performanceMetrics)}
                        </div>
                    </motion.div>
                )}
                <div className="dashboard-actions">
                    <h2>Strategic Actions</h2>
                    <button onClick={() => console.log('View detailed financial reports')}>View Detailed Financial Reports</button>
                    <button onClick={() => console.log('Schedule board meeting')}>Schedule Board Meeting</button>
                    <button onClick={() => console.log('Review expansion opportunities')}>Review Expansion Opportunities</button>
                    <button onClick={toggleAIAssistant}>
                        {showAIAssistant ? 'Hide AI Assistant' : 'Show AI Assistant'}
                    </button>
                </div>
                <AnimatePresence>
                    {showAIAssistant && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 20 }}
                        >
                            <Suspense fallback={<div>Loading AI Assistant...</div>}>
                                <AIAssistant
                                    onSendMessage={handleAIMessage}
                                    aiMessage={aiMessage}
                                />
                            </Suspense>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </ErrorBoundary>
    );
};

const StatCard = React.memo(({ title, value }) => (
    <motion.div 
        className="stat-card"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
    >
        <h3>{title}</h3>
        <p>{value}</p>
    </motion.div>
));

const ErrorFallback = ({ error }) => (
    <div className="error-fallback">
        <h2>Oops! Something went wrong.</h2>
        <p>Error: {error.message}</p>
        <button onClick={() => window.location.reload()}>Refresh Page</button>
    </div>
);

export default Dashboard;
// Initialize GSAP ScrollTrigger
useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    // Animate sections
    gsap.utils.toArray('.animated-section').forEach(section => {
        gsap.from(section, {
            opacity: 0,
            y: 50,
            duration: 1,
            scrollTrigger: {
                trigger: section,
                start: "top 80%",
                end: "bottom 20%",
                toggleActions: "play none none reverse"
            }
        });
    });
}, []);

// Initialize tooltips
useEffect(() => {
    tippy('[data-tippy-content]', {
        arrow: true,
        delay: [50, 0],
        theme: 'light-border',
    });
}, []);

const displaySummaryCards = useCallback((summary) => {
    return Object.entries(summary).map(([key, value]) => (
        <StatCard key={key} title={key} value={value} />
    ));
}, []);

const displayRecentShipments = useCallback((shipments) => {
    return shipments.map(shipment => (
        <motion.div key={shipment.id} className="shipment-card" whileHover={{ scale: 1.05 }}>
            <h4>{shipment.id}</h4>
            <p>Status: {shipment.status}</p>
            <p>Destination: {shipment.destination}</p>
        </motion.div>
    ));
}, []);

const displayPerformanceMetrics = useCallback((metrics) => {
    return (
        <ResponsiveContainer width="100%" height={300}>
            <BarChart data={metrics}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#8884d8" />
            </BarChart>
        </ResponsiveContainer>
    );
}, []);

const displayAIInsights = useCallback((insights) => {
    return insights.map(insight => (
        <motion.div key={insight.title} className="ai-insight" whileHover={{ scale: 1.05 }}>
            <h4>{insight.title}</h4>
            <p>{insight.description}</p>
        </motion.div>
    ));
}, []);

const displayFinancialOverview = useCallback((financialData) => {
    return (
        <ResponsiveContainer width="100%" height={300}>
            <LineChart data={financialData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="value" stroke="#8884d8" />
            </LineChart>
        </ResponsiveContainer>
    );
}, []);

const displayComplianceStatus = useCallback((complianceStatus) => {
    return (
        <div className={`compliance-status ${complianceStatus.overall ? 'compliant' : 'non-compliant'}`}>
            <h3>Overall Status: {complianceStatus.overall ? 'Compliant' : 'Non-Compliant'}</h3>
            <ul>
                {Object.entries(complianceStatus.details).map(([key, value]) => (
                    <li key={key}>
                        <span>{key}:</span>
                        <span className={value ? 'compliant' : 'non-compliant'}>
                            {value ? 'Compliant' : 'Non-Compliant'}
                        </span>
                    </li>
                ))}
            </ul>
        </div>
    );
}, []);

if (isDashboardLoading) return <div>Loading dashboard data...</div>;
if (dashboardError) return <div>Error loading dashboard data: {dashboardError.message}</div>;

return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
        <div className="dashboard">
            <section id="dashboard-summary" className="animated-section">
                <h2>Dashboard Summary</h2>
                <div className="summary-cards">
                    {displaySummaryCards(dashboardData.summary)}
                </div>
            </section>
            
            <section id="recent-shipments" className="animated-section">
                <h2>Recent Shipments</h2>
                <div className="shipment-list">
                    {displayRecentShipments(dashboardData.recentShipments)}
                </div>
            </section>
            
            <section id="performance-metrics" className="animated-section">
                <h2>Performance Metrics</h2>
                {displayPerformanceMetrics(dashboardData.performanceMetrics)}
            </section>
            
            <section id="ai-insights" className="animated-section">
                <h2>AI Insights</h2>
                <div className="ai-recommendations">
                    {displayAIInsights(dashboardData.aiInsights)}
                </div>
            </section>

            <section id="financial-overview" className="animated-section">
                <h2>Financial Overview</h2>
                {displayFinancialOverview(dashboardData.financialData)}
            </section>

            <section id="compliance-status" className="animated-section">
                <h2>Compliance Status</h2>
                {displayComplianceStatus(dashboardData.complianceStatus)}
            </section>
