import React, { Suspense, lazy, useEffect, useCallback } from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { ErrorBoundary } from 'react-error-boundary';
import store from '../../store/configureStore';
import { GlobalStyles } from '../../styles/GlobalStyles';
import { ExtremeLoader } from '../../components/ExtremeLoader';
import { theme } from '../../styles/theme';
import { VoiceCommandListener } from '../../components/VoiceCommandListener';
import { initializeExtremeFeatures, enterSafeMode, handleRandomAction } from '../../utils/extremeFeatures';
import { useQuantumState } from '../../hooks/useQuantumState';
import { useInterdimensionalCommunication } from '../../hooks/useInterdimensionalCommunication';
import { AppProps } from '../../types';

const App = lazy(() => import('./App'));

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

const ExtremeApp: React.FC = () => {
  const { quantumState, stabilizeQuantumState } = useQuantumState();
  const { interdimensionalMessage, communicateInterdimensionally } = useInterdimensionalCommunication();

  useEffect(() => {
    const initFeatures = async () => {
      try {
        await initializeExtremeFeatures();
        console.log("All extreme features initialized successfully!");
      } catch (error) {
        console.error("Failed to initialize extreme features:", error);
        enterSafeMode();
      }
    };

    initFeatures();
  }, []);

  const handleExtremeAction = useCallback((action: number) => {
    handleRandomAction(action, communicateInterdimensionally);
  }, [communicateInterdimensionally]);

  useEffect(() => {
    const extremeInterval = setInterval(() => {
      const randomAction = Math.floor(Math.random() * 5);
      const randomDelay = Math.floor(Math.random() * 10000) + 1000;

      setTimeout(() => handleExtremeAction(randomAction), randomDelay);
    }, 5000);

    return () => clearInterval(extremeInterval);
  }, [handleExtremeAction]);

  return (
    <React.StrictMode>
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <ThemeProvider theme={theme}>
          <Provider store={store}>
            <Router>
              <GlobalStyles />
              <VoiceCommandListener />
              <Suspense fallback={<ExtremeLoader message="Igniting the freight revolution and bending reality..." />}>
                <App quantumState={quantumState} interdimensionalMessage={interdimensionalMessage} />
              </Suspense>
            </Router>
          </Provider>
        </ThemeProvider>
      </ErrorBoundary>
    </React.StrictMode>
  );
};

interface ErrorFallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
}

const ErrorFallback: React.FC<ErrorFallbackProps> = ({ error, resetErrorBoundary }) => {
  return (
    <div role="alert">
      <h2>Oops! A quantum fluctuation occurred:</h2>
      <pre>{error.message}</pre>
      <button onClick={resetErrorBoundary}>Try again</button>
    </div>
  );
};

root.render(<ExtremeApp />);

