import React, { useReducer } from 'react';
import App from './App';

const AppContext = React.createContext({});

export const initialState = {
  category: '',
};

const actionFunction = (state, action) => {
  switch (action.type) {
    case 'changeEvent':
      return { ...state, ...action };
    default:
      return { ...state, ...action };
  }
};

export function WrappedApp() {
  const reducer = useReducer(actionFunction, { ...initialState });
  return (
    <AppContext.Provider value={reducer}>
      <App />
    </AppContext.Provider>
  );
}

export default AppContext;
