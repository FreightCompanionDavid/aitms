import { createStore, combineReducers } from 'redux';

const authReducer = (state = { isAuthenticated: false, user: null }, action) => {
    switch (action.type) {
        case 'LOGIN':
            return { ...state, isAuthenticated: true, user: action.payload };
        case 'LOGOUT':
            return { ...state, isAuthenticated: false, user: null };
        default:
            return state;
    }
};

const rootReducer = combineReducers({
    auth: authReducer,
    // Add other reducers here
});

const store = createStore(rootReducer);

export default store;
