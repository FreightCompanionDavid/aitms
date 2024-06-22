import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { activateLudicrousMode, deactivateLudicrousMode } from '../../actions/ludicrousActions';
import { unleashChaos } from '../../utils/chaosEngine';
import { AIAssistant } from '../../utils/AIAssistant';
import VoiceCommands from '../../VoiceCommands';
import ParticleEffects from '../../ParticleEffects';
import { socket } from '../../services/socketService';

const AIAssistantChat = () => {
  const dispatch = useDispatch();
  const extremeModeEnabled = useSelector(state => state.extremeMode.enabled);
  const userFingerprint = useSelector(state => state.user.fingerprint);
  
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [aiPersonality, setAiPersonality] = useState('normal');
  
  const chatRef = useRef(null);
  const aiAssistant = useRef(new AIAssistant());
  const voiceCommands = useRef(new VoiceCommands());
  
  useEffect(() => {
    socket.on('extreme_mode_update', handleExtremeModeUpdate);
    return () => {
      socket.off('extreme_mode_update', handleExtremeModeUpdate);
    };
  }, []);

  useEffect(() => {
    if (extremeModeEnabled) {
      dispatch(activateLudicrousMode());
      setAiPersonality('extreme');
      aiAssistant.current.goExtreme();
      voiceCommands.current.addCommand('unleash chaos', unleashChaos);
      ParticleEffects.createExtremeParticles(1000000);
    } else {
      dispatch(deactivateLudicrousMode());
      setAiPersonality('normal');
      aiAssistant.current.calmDown();
      voiceCommands.current.removeCommand('unleash chaos');
      ParticleEffects.removeExtremeParticles();
    }
  }, [extremeModeEnabled, dispatch]);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  const handleExtremeModeUpdate = (data) => {
    if (data.fingerprint === userFingerprint) {
      dispatch({ type: 'TOGGLE_EXTREME_MODE', payload: data.enabled });
    }
  };

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const newMessage = { text: input, sender: 'user' };
    setMessages(prevMessages => [...prevMessages, newMessage]);
    setInput('');
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.post('/api/chat', { message: input, personality: aiPersonality });
      const aiResponse = { text: response.data.message, sender: 'ai' };
      setMessages(prevMessages => [...prevMessages, aiResponse]);
      
      if (extremeModeEnabled) {
        unleashChaos(response.data.chaosLevel);
      }
    } catch (err) {
      setError('Failed to get AI response. The chaos is too strong!');
      console.error('Error sending message:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.post('/api/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      const newMessage = { text: `File uploaded: ${file.name}`, sender: 'system' };
      setMessages(prevMessages => [...prevMessages, newMessage]);
      
      if (extremeModeEnabled) {
        ParticleEffects.createFileUploadExplosion(file.name);
      }
    } catch (err) {
      setError('Failed to upload file. The server gremlins are acting up!');
      console.error('Error uploading file:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`ai-assistant-chat ${extremeModeEnabled ? 'extreme-mode' : ''}`}>
      <div className="chat-messages" ref={chatRef}>
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.sender} ${extremeModeEnabled ? 'extreme' : ''}`}>
            {msg.text}
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
    </div>
  );
};

export default AIAssistantChat;

