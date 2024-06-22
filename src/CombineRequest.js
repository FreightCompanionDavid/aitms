import React, { useState } from 'react';
import { useAIAssistant } from '../../hooks/useAIAssistant';
import styled from 'styled-components';

const APICombinerWrapper = styled.div`
  background-color: #1a1a1a;
  color: #ff4500;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 0 20px rgba(255, 69, 0, 0.5);
`;

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
`;

const StyledTextarea = styled.textarea`
  background-color: #2a2a2a;
  color: #00ff00;
  border: 2px solid #ff4500;
  border-radius: 5px;
  padding: 10px;
  margin-bottom: 10px;
  font-family: 'Orbitron', sans-serif;
`;

const StyledButton = styled.button`
  background-color: #ff4500;
  color: #1a1a1a;
  border: none;
  border-radius: 5px;
  padding: 10px 20px;
  font-family: 'Orbitron', sans-serif;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background-color: #ff6347;
    transform: scale(1.05);
  }
`;

const APICombiner = ({ onCombineRequest }) => {
  const [goal, setGoal] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { getAISuggestion } = useAIAssistant();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const aiSuggestion = await getAISuggestion(goal);
      onCombineRequest(goal, aiSuggestion);
    } catch (err) {
      setError('Error getting API combination suggestion. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setGoal('');
    setError(null);
  };

  return (
    <APICombinerWrapper>
      <h2>Combine APIs</h2>
      <StyledForm onSubmit={handleSubmit}>
        <StyledTextarea
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
          placeholder="Describe your goal for combining APIs..."
          rows={4}
          cols={50}
        />
        <div>
          <StyledButton type="submit" disabled={loading}>
            {loading ? 'Processing...' : 'Get Combination Suggestion'}
          </StyledButton>
          <StyledButton type="button" onClick={handleReset}>
            Reset
          </StyledButton>
        </div>
      </StyledForm>
      {error && <p style={{ color: '#ff0000' }}>{error}</p>}
    </APICombinerWrapper>
  );
};

export default APICombiner;

