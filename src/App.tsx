import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
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
              <Switch>
                <Route exact path="/" component={Dashboard} />
                <Route path="/chat" component={AIAssistantChat} />
                <Route path="/ask" component={AskAI} />
                <Route path="/visualize" component={FreightVisualizer} />
                <Route path="/customs" component={CustomsDeclaration} />
                <Route path="/track" component={TrackShipment} />
                <Route path="/analytics" component={Analytics} />
                <Route path="/dangerous-goods" component={DangerousGoods} />
                <Route path="/quick-pass" component={QuickPass} />
                <Route path="/profile" component={UserProfile} />
                <Route path="/settings" component={Settings} />
              </Switch>
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
