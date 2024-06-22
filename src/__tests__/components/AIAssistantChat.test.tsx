import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import AIAssistantChat from '../../components/AIAssistantChat';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

const mockStore = configureStore([thunk]);

describe('AIAssistantChat Component', () => {
  let store;

  beforeEach(() => {
    store = mockStore({
      ai: {
        messages: [],
        isLoading: false,
        error: null
      }
    });
  });

  test('renders AIAssistantChat component', () => {
    render(
      <Provider store={store}>
        <AIAssistantChat />
      </Provider>
    );
    expect(screen.getByTestId('ai-assistant-chat')).toBeInTheDocument();
  });

  test('displays chat messages', () => {
    store = mockStore({
      ai: {
        messages: [
          { role: 'user', content: 'Hello' },
          { role: 'assistant', content: 'Hi there! How can I help you?' }
        ],
        isLoading: false,
        error: null
      }
    });

    render(
      <Provider store={store}>
        <AIAssistantChat />
      </Provider>
    );

    expect(screen.getByText('Hello')).toBeInTheDocument();
    expect(screen.getByText('Hi there! How can I help you?')).toBeInTheDocument();
  });

  test('allows user to send a message', async () => {
    render(
      <Provider store={store}>
        <AIAssistantChat />
      </Provider>
    );

    const input = screen.getByPlaceholderText('Type your message...');
    const sendButton = screen.getByText('Send');

    fireEvent.change(input, { target: { value: 'Test message' } });
    fireEvent.click(sendButton);

    await waitFor(() => {
      const actions = store.getActions();
      expect(actions).toContainEqual(expect.objectContaining({
        type: 'ai/sendMessage',
        payload: 'Test message'
      }));
    });
  });

  test('displays loading state', () => {
    store = mockStore({
      ai: {
        messages: [],
        isLoading: true,
        error: null
      }
    });

    render(
      <Provider store={store}>
        <AIAssistantChat />
      </Provider>
    );

    expect(screen.getByText('AI is thinking...')).toBeInTheDocument();
  });

  test('displays error message', () => {
    store = mockStore({
      ai: {
        messages: [],
        isLoading: false,
        error: 'An error occurred'
      }
    });

    render(
      <Provider store={store}>
        <AIAssistantChat />
      </Provider>
    );

    expect(screen.getByText('An error occurred')).toBeInTheDocument();
  });
});
