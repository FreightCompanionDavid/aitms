import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { activateLudicrousMode, deactivateLudicrousMode } from '../actions/ludicrousActions';
import { unleashChaos } from '../utils/chaosEngine';
import { AIAssistant } from '../utils/AIAssistant';
import VoiceCommands from '../services/VoiceCommands';
import ParticleEffects from '../utils/ParticleEffects';
import { socket } from '../services/socketService';
import { RootState } from '../store/rootReducer';
import { generateSuggestions, applySuggestion } from '../actions/aiActions';
import debounce from 'lodash/debounce';
import { UserActivityTracker } from '../utils/UserActivityTracker';
import { APIDocManager } from '../utils/APIDocManager';
import { Visualize } from './Visualize';
import { FreightForms } from './components/FreightForms';
import { CopilotAssistant } from '../utils/CopilotAssistant';
import { ThreeDVisualizer } from './3DFreightVisualizer';
import '../styles/LudicrousMode.css';
import '../styles/FreightForms.css';
import '../styles/ExtremeAnimations.css';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai' | 'system';
  timestamp: number;
}

const AIAssistantChat: React.FC = () => {
  const dispatch = useDispatch();
  const extremeModeEnabled = useSelector((state: RootState) => state.extremeMode.enabled);
  const userFingerprint = useSelector((state: RootState) => state.user.fingerprint);
  const aiSuggestions = useSelector((state: RootState) => state.ai.suggestions);
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [aiPersonality, setAiPersonality] = useState<'normal' | 'extreme'>('normal');
  
  const chatRef = useRef<HTMLDivElement>(null);
  const aiAssistant = useRef(new AIAssistant());
  const voiceCommands = useRef(new VoiceCommands());
  const userActivityTracker = useRef(new UserActivityTracker());
  const apiDocManager = useRef(new APIDocManager());
  const copilotAssistant = useRef(new CopilotAssistant());
  
  useEffect(() => {
    socket.on('extreme_mode_update', handleExtremeModeUpdate);
    userActivityTracker.current.startTracking();
    apiDocManager.current.loadDocs();
    return () => {
      socket.off('extreme_mode_update', handleExtremeModeUpdate);
      userActivityTracker.current.stopTracking();
    };
  }, []);

  useEffect(() => {
    if (extremeModeEnabled) {
      dispatch(activateLudicrousMode());
      setAiPersonality('extreme');
      aiAssistant.current.goExtreme();
      voiceCommands.current.addCommand('unleash chaos', unleashChaos);
      ParticleEffects.createExtremeParticles(1000000);
      copilotAssistant.current.activateExtremeSuggestions();
    } else {
      dispatch(deactivateLudicrousMode());
      setAiPersonality('normal');
      aiAssistant.current.calmDown();
      voiceCommands.current.removeCommand('unleash chaos');
      ParticleEffects.removeExtremeParticles();
      copilotAssistant.current.deactivateExtremeSuggestions();
    }
  }, [extremeModeEnabled, dispatch]);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  const handleExtremeModeUpdate = useCallback((data: { fingerprint: string; enabled: boolean }) => {
    if (data.fingerprint === userFingerprint) {
      dispatch({ type: 'TOGGLE_EXTREME_MODE', payload: data.enabled });
    }
  }, [dispatch, userFingerprint]);

  const debouncedGenerateSuggestions = useMemo(
    () => debounce((input: string) => {
      dispatch(generateSuggestions({ input }));
    }, 300),
    [dispatch]
  );

  useEffect(() => {
    if (input.trim()) {
      debouncedGenerateSuggestions(input);
    }
  }, [input, debouncedGenerateSuggestions]);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const newMessage: Message = { 
      id: Date.now().toString(), 
      text: input, 
      sender: 'user', 
      timestamp: Date.now() 
    };
    setMessages(prevMessages => [...prevMessages, newMessage]);
    setInput('');
    setIsLoading(true);
    setError(null);

    try {
      const response = await aiAssistant.current.generateResponse(input);
      const aiResponse: Message = { 
        id: Date.now().toString(), 
        text: response, 
        sender: 'ai', 
        timestamp: Date.now() 
      };
      setMessages(prevMessages => [...prevMessages, aiResponse]);
      
      if (extremeModeEnabled) {
        unleashChaos(Math.random());
      }
      
      userActivityTracker.current.logActivity('message_sent');
      copilotAssistant.current.analyzeInteraction(input, response);
    } catch (err) {
      setError('Failed to get AI response. The chaos is too strong!');
      console.error('Error sending message:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error('File upload failed');
      }

      const result = await response.json();
      const newMessage: Message = { 
        id: Date.now().toString(), 
        text: `File uploaded: ${file.name}`, 
        sender: 'system', 
        timestamp: Date.now() 
      };
      setMessages(prevMessages => [...prevMessages, newMessage]);
      
      if (extremeModeEnabled) {
        ParticleEffects.createFileUploadExplosion(file.name);
      }
      
      userActivityTracker.current.logActivity('file_uploaded');
      apiDocManager.current.processUploadedFile(file);
    } catch (err) {
      setError('Failed to upload file. The server gremlins are acting up!');
      console.error('Error uploading file:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion);
    dispatch(applySuggestion('input', suggestion));
    userActivityTracker.current.logActivity('suggestion_used');
  };

  const handleVoiceCommand = useCallback((command: string) => {
    switch (command.toLowerCase()) {
      case 'send message':
        handleSendMessage();
        break;
      case 'clear chat':
        setMessages([]);
        break;
      case 'toggle extreme mode':
        dispatch({ type: 'TOGGLE_EXTREME_MODE', payload: !extremeModeEnabled });
        break;
      default:
        console.log(`Unrecognized voice command: ${command}`);
    }
    userActivityTracker.current.logActivity('voice_command_used');
  }, [dispatch, extremeModeEnabled, handleSendMessage]);

  useEffect(() => {
    voiceCommands.current.addCommand('send message', handleVoiceCommand);
    voiceCommands.current.addCommand('clear chat', handleVoiceCommand);
    voiceCommands.current.addCommand('toggle extreme mode', handleVoiceCommand);

    return () => {
      voiceCommands.current.removeCommand('send message');
      voiceCommands.current.removeCommand('clear chat');
      voiceCommands.current.removeCommand('toggle extreme mode');
    };
  }, [handleVoiceCommand]);

  return (
    <div className={`ai-assistant-chat ${extremeModeEnabled ? 'extreme-mode' : ''}`}>
      <div className="chat-messages" ref={chatRef}>
        {messages.map((msg) => (
          <div key={msg.id} className={`message ${msg.sender} ${extremeModeEnabled ? 'extreme' : ''}`}>
            {msg.text}
            <span className="timestamp">{new Date(msg.timestamp).toLocaleTimeString()}</span>
          </div>
        ))}
        {isLoading && <div className="message system">AI is thinking... or plotting world domination</div>}
        {error && <div className="message error">{error}</div>}
      </div>
      <div className="chat-input">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          placeholder={extremeModeEnabled ? "Ask anything, if you dare..." : "Ask the AI anything..."}
          disabled={isLoading}
        />
        <button onClick={handleSendMessage} disabled={isLoading}>
          {extremeModeEnabled ? "SEND OR ELSE" : "Send"}
        </button>
        <input type="file" onChange={handleFileUpload} disabled={isLoading} />
        <button onClick={() => dispatch({ type: 'TOGGLE_EXTREME_MODE', payload: !extremeModeEnabled })}>
          {extremeModeEnabled ? "Deactivate Extreme Mode" : "Activate Extreme Mode"}
        </button>
      </div>
      {Object.keys(aiSuggestions).length > 0 && (
        <div className="ai-suggestions">
          <h4>AI Suggestions:</h4>
          {Object.entries(aiSuggestions).map(([key, value]) => (
            <button key={key} onClick={() => handleSuggestionClick(typeof value === 'string' ? value : String(value))}>
              {typeof value === 'string' ? value : String(value)}
            </button>
          ))}
        </div>
      )}
      <FreightForms />
      <Visualize />
      <ThreeDVisualizer />
    </div>
  );
};

export default AIAssistantChat;
