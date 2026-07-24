import React from 'react';
import Routes from './Routes';
import { CurrencyProvider } from './context/CurrencyContext';
import { ThemeProvider } from './contexts/ThemeContext';

const App = () => {
  return (
    <ThemeProvider>
      <CurrencyProvider>
        <Routes />
      </CurrencyProvider>
    </ThemeProvider>
  );
};

export default App;
