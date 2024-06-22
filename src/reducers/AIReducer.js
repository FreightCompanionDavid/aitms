import { APPLY_SUGGESTION, SET_SUGGESTIONS } from '../actions/aiActions';

interface AIState {
  suggestions: Record<string, string>;
  appliedSuggestions: string[];
}

const initialState: AIState = {
  suggestions: {},
  appliedSuggestions: [],
};

const aiReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case APPLY_SUGGESTION:
      return {
        ...state,
        appliedSuggestions: [...state.appliedSuggestions, action.payload.field],
      };
    case SET_SUGGESTIONS:
      return {
        ...state,
        suggestions: action.payload,
      };
    default:
      return state;
  }
};

export default aiReducer;
