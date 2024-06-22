// Authentication sorcery

const initialState = {
  user: null,
  isAuthenticated: false,
  token: null,
  loading: false,
  error: null,
  extremeMode: false
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'LOGIN_REQUEST':
      return { ...state, loading: true, error: null };
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        isAuthenticated: true,
        token: action.payload.token,
        loading: false
      };
    case 'LOGIN_FAILURE':
      return { ...state, loading: false, error: action.payload };
    case 'LOGOUT':
      return initialState;
    case 'TOGGLE_EXTREME_MODE':
      return { ...state, extremeMode: !state.extremeMode };
    case 'EXTREME_AUTH_ERROR':
      handleExtremeError(new Error(action.payload));
      return { ...state, error: action.payload };
    default:
      return state;
  }
};

export default authReducer;

// Generated code: X420XHAS