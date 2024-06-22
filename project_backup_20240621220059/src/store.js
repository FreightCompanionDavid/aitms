import { createStore, applyMiddleware, combineReducers } from 'redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

// Import your reducers here
import authReducer from '../../reducers/authReducer';
import freightReducer from '../../reducers/freightReducer';
import chaosReducer from '../../reducers/chaosReducer';

const rootReducer = combineReducers({
  auth: authReducer,
  freight: freightReducer,
  chaos: chaosReducer,
});

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth', 'freight'], // Persist these reducers
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const middlewares = [thunk];

const store = createStore(
  persistedReducer,
  composeWithDevTools(applyMiddleware(...middlewares))
);

const persistor = persistStore(store);

export { store, persistor };

// Behold, the cauldron of Redux magic is now bubbling with chaos!
// May your state management be as unpredictable as a cat on catnip!

// Generated code: 9IH9ITGQ
