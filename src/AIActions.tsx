import { Dispatch } from 'redux';
import AIAssistant from '../utils/AIAssistant';
import { AppThunk } from '../types';
import { RootState } from '../store/rootReducer';

// Action Types
export const APPLY_SUGGESTION = 'APPLY_SUGGESTION';
export const SET_SUGGESTIONS = 'SET_SUGGESTIONS';
export const GENERATE_SUGGESTIONS_REQUEST = 'GENERATE_SUGGESTIONS_REQUEST';
export const GENERATE_SUGGESTIONS_SUCCESS = 'GENERATE_SUGGESTIONS_SUCCESS';
export const GENERATE_SUGGESTIONS_FAILURE = 'GENERATE_SUGGESTIONS_FAILURE';
export const CLEAR_SUGGESTIONS = 'CLEAR_SUGGESTIONS';

// Action Creators
export const applySuggestion = (field: string, value: string) => ({
  type: APPLY_SUGGESTION,
  payload: { field, value },
});

export const setSuggestions = (suggestions: Record<string, string>) => ({
  type: SET_SUGGESTIONS,
  payload: suggestions,
});

const generateSuggestionsRequest = () => ({
  type: GENERATE_SUGGESTIONS_REQUEST,
});

const generateSuggestionsSuccess = (suggestions: Record<string, string>) => ({
  type: GENERATE_SUGGESTIONS_SUCCESS,
  payload: suggestions,
});

const generateSuggestionsFailure = (error: string) => ({
  type: GENERATE_SUGGESTIONS_FAILURE,
  payload: error,
});

export const clearSuggestions = () => ({
  type: CLEAR_SUGGESTIONS,
});

// Thunk Action Creator
export const generateSuggestions = (formData: any): AppThunk => {
  return async (dispatch: Dispatch, getState: () => RootState) => {
    dispatch(generateSuggestionsRequest());
    try {
      const apiKey = getState().config.openAIApiKey;
      if (!apiKey) {
        throw new Error('OpenAI API key is not set');
      }
      const aiAssistant = new AIAssistant(apiKey);
      const suggestions = await aiAssistant.generateSuggestions(formData);
      dispatch(generateSuggestionsSuccess(suggestions));
      dispatch(setSuggestions(suggestions));
    } catch (error) {
      console.error('Error generating suggestions:', error);
      dispatch(generateSuggestionsFailure(error instanceof Error ? error.message : 'Unknown error'));
    }
  };
};

// Utility function to validate suggestions
export const validateSuggestions = (suggestions: Record<string, string>): boolean => {
  return Object.values(suggestions).every(suggestion => suggestion.length > 0);
};

// Type for all possible actions
export type AIAction = 
  | ReturnType<typeof applySuggestion>
  | ReturnType<typeof setSuggestions>
  | ReturnType<typeof generateSuggestionsRequest>
  | ReturnType<typeof generateSuggestionsSuccess>
  | ReturnType<typeof generateSuggestionsFailure>
  | ReturnType<typeof clearSuggestions>;

// Selector
export const getSuggestions = (state: RootState) => state.ai.suggestions;
