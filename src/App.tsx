import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store';
import Dashboard from './components/Dashboard';
import AIAssistantChat from './components/AIAssistantChat';
import Header from './components/Header';
import Footer from './components/Footer';
import ErrorBoundary from './components/ErrorBoundary';
import AskAI from './components/AskAI';
import FreightVisualizer from './components/FreightVisualizer';
import CustomsDeclaration from './components/CustomsDeclaration';
import TrackShipment from './components/TrackShipment';
import Analytics from './components/Analytics';
import DangerousGoods from './components/DangerousGoods';
import QuickPass from './components/QuickPass';
import UserProfile from './components/UserProfile';
import Settings from './components/Settings';

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <ErrorBoundary>
        <Router>
          <div className="app">
            <Header />
            <main>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/chat" element={<AIAssistantChat />} />
                <Route path="/ask" element={<AskAI />} />
                <Route path="/visualize" element={<FreightVisualizer />} />
                <Route path="/customs" element={<CustomsDeclaration />} />
                <Route path="/track" element={<TrackShipment />} />
                <Route path="/analytics" element={<Analytics />} />
                <Route path="/dangerous-goods" element={<DangerousGoods />} />
                <Route path="/quick-pass" element={<QuickPass />} />
                <Route path="/profile" element={<UserProfile />} />
                <Route path="/settings" element={<Settings />} />
              </Routes>
            </main>
            <Footer />
            <div id="app-container">
              <AIAssistantChat />
              <FreightVisualizer />
            </div>
          </div>
        </Router>
      </ErrorBoundary>
    </Provider>
  );
};

export default App;
