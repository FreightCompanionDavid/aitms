import React, { useState, useEffect, useCallback, useMemo } from 'react';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSuggestions, applySuggestion, clearSuggestions, toggleFavorite } from '../redux/actions/copilotActions';
import { RootState } from '../redux/store';
import { Suggestion } from '../types/copilotTypes';
import { debounce } from 'lodash';
import InsightVisualizer from './InsightVisualizer';

const AssistantContainer = styled.div`
  background-color: #f0f8ff;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  max-width: 600px;
  margin: 0 auto;
`;

const Title = styled.h3`
  color: #333;
  font-size: 20px;
  margin-bottom: 16px;
  text-align: center;
`;

const SuggestionList = styled.ul`
  list-style-type: none;
  padding: 0;
  max-height: 300px;
  overflow-y: auto;
`;

const SuggestionItem = styled.li`
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-bottom: 12px;
  padding: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    transform: translateY(-2px);
  }
`;

const SuggestionText = styled.span`
  flex: 1;
  font-size: 16px;
`;

const ApplyButton = styled.button`
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 8px 16px;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.2s;
  font-size: 14px;
  font-weight: bold;

  &:hover {
    background-color: #45a049;
    transform: scale(1.05);
  }

  &:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }
`;

const LoadingMessage = styled.p`
  color: #666;
  font-style: italic;
  text-align: center;
`;

const ErrorMessage = styled.p`
  color: #d32f2f;
  text-align: center;
  font-weight: bold;
`;

const RefreshButton = styled.button`
  background-color: #2196f3;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 8px 16px;
  cursor: pointer;
  transition: background-color 0.3s;
  font-size: 14px;
  margin-top: 16px;
  display: block;
  margin-left: auto;
  margin-right: auto;

  &:hover {
    background-color: #1976d2;
  }
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 8px;
  margin-bottom: 16px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
`;

const FilterContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 16px;
`;

const CategorySelect = styled.select`
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 8px;
`;

const CopyButton = styled.button`
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 8px 16px;
  cursor: pointer;
  transition: background-color 0.3s;
  font-size: 14px;

  &:hover {
    background-color: #45a049;
  }
`;

const FavoriteButton = styled.button<{ isFavorite: boolean }>`
  background-color: ${props => props.isFavorite ? '#ffd700' : '#ffffff'};
  color: ${props => props.isFavorite ? '#000000' : '#666666'};
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 4px 8px;
  cursor: pointer;
  transition: all 0.3s;
  font-size: 14px;

  &:hover {
    background-color: ${props => props.isFavorite ? '#ffc800' : '#f0f0f0'};
  }
`;

const AnalyzeButton = styled.button`
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 8px 16px;
  cursor: pointer;
  transition: background-color 0.3s;
  font-size: 14px;
  margin-top: 16px;

  &:hover {
    background-color: #0056b3;
  }
`;

const ModifyButton = styled.button`
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 8px 16px;
  cursor: pointer;
  transition: background-color 0.3s;
  font-size: 14px;
  margin-left: 8px;

  &:hover {
    background-color: #218838;
  }
`;

const CopilotAssistant: React.FC = () => {
  const dispatch = useDispatch();
  const { suggestions, isLoading, error } = useSelector((state: RootState) => state.copilot);
  const [appliedSuggestions, setAppliedSuggestions] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('all');
  const [showFavorites, setShowFavorites] = useState(false);
  const [pageContent, setPageContent] = useState<string>('');
  const [showVisualizer, setShowVisualizer] = useState(false);

  const debouncedFetchSuggestions = useCallback(
    debounce(() => dispatch(fetchSuggestions()), 500),
    [dispatch]
  );

  useEffect(() => {
    debouncedFetchSuggestions();
    return () => {
      dispatch(clearSuggestions());
    };
  }, [dispatch, debouncedFetchSuggestions]);

  const handleSuggestionApply = (suggestion: Suggestion) => {
    dispatch(applySuggestion(suggestion.id));
    setAppliedSuggestions([...appliedSuggestions, suggestion.id]);
  };

  const handleRefresh = () => {
    dispatch(clearSuggestions());
    debouncedFetchSuggestions();
  };

  const handleCopyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      // You can add a toast notification here to inform the user that the text has been copied
      console.log('Suggestion copied to clipboard');
    });
  };

  const handleToggleFavorite = (suggestion: Suggestion) => {
    dispatch(toggleFavorite(suggestion.id));
  };

  const analyzeCurrentPage = () => {
    const content = document.body.innerText;
    setPageContent(content);
    setShowVisualizer(true);
  };

  const filteredSuggestions = useMemo(() => {
    return suggestions
      .filter(suggestion =>
        suggestion.text.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (category === 'all' || suggestion.category === category) &&
        (!showFavorites || suggestion.isFavorite)
      );
  }, [suggestions, searchTerm, category, showFavorites]);

  const categories = useMemo(() => {
    const uniqueCategories = new Set(suggestions.map(s => s.category));
    return ['all', ...Array.from(uniqueCategories)];
  }, [suggestions]);

  return (
    <AssistantContainer>
      <Title>🚀 Copilot Suggestions</Title>
      <FilterContainer>
        <SearchInput
          type="text"
          placeholder="Search suggestions..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <CategorySelect value={category} onChange={(e) => setCategory(e.target.value)}>
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
          ))}
        </CategorySelect>
        <FavoriteButton
          isFavorite={showFavorites}
          onClick={() => setShowFavorites(!showFavorites)}
        >
          {showFavorites ? 'Show All' : 'Show Favorites'}
        </FavoriteButton>
      </FilterContainer>
      {isLoading && <LoadingMessage>Analyzing your code for suggestions...</LoadingMessage>}
      {error && <ErrorMessage>Error: {error}</ErrorMessage>}
      <SuggestionList>
        {filteredSuggestions.map((suggestion) => (
          <SuggestionItem key={suggestion.id}>
            <SuggestionText>{suggestion.text}</SuggestionText>
            <ButtonContainer>
              <ApplyButton 
                onClick={() => handleSuggestionApply(suggestion)}
                disabled={appliedSuggestions.includes(suggestion.id)}
              >
                {appliedSuggestions.includes(suggestion.id) ? 'Applied' : 'Apply'}
              </ApplyButton>
              <CopyButton onClick={() => handleCopyToClipboard(suggestion.text)}>Copy</CopyButton>
              <FavoriteButton
                isFavorite={suggestion.isFavorite}
                onClick={() => handleToggleFavorite(suggestion)}
              >
                {suggestion.isFavorite ? '★' : '☆'}
              </FavoriteButton>
            </ButtonContainer>
          </SuggestionItem>
        ))}
      </SuggestionList>
      {!isLoading && filteredSuggestions.length === 0 && (
        <LoadingMessage>No suggestions available at the moment.</LoadingMessage>
      )}
      <RefreshButton onClick={handleRefresh}>Refresh Suggestions</RefreshButton>
      <AnalyzeButton onClick={analyzeCurrentPage}>
        Analyze Current Page
      </AnalyzeButton>
      {showVisualizer && <InsightVisualizer pageContent={pageContent} />}
      <ModifyButton>Modify Page</ModifyButton>
    </AssistantContainer>
  );
};

export default CopilotAssistant;
