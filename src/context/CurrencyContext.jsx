import React, { createContext, useContext, useState, useCallback } from 'react';

export const CURRENCIES = [
  { code: 'INR', symbol: '₹', name: 'Indian Rupee', locale: 'en-IN' },
  { code: 'USD', symbol: '$', name: 'US Dollar', locale: 'en-US' },
  { code: 'EUR', symbol: '€', name: 'Euro', locale: 'de-DE' },
  { code: 'GBP', symbol: '£', name: 'British Pound', locale: 'en-GB' },
];

const CurrencyContext = createContext(null);

export const CurrencyProvider = ({ children }) => {
  const [currencyCode, setCurrencyCode] = useState(() => {
    return localStorage.getItem('preferredCurrency') || 'INR';
  });

  const currency = CURRENCIES?.find((c) => c?.code === currencyCode) || CURRENCIES?.[0];

  const formatCurrency = useCallback(
    (amount) => {
      if (amount === null || amount === undefined) return `${currency?.symbol}0.00`;
      return `${currency?.symbol}${Number(amount)?.toFixed(2)}`;
    },
    [currency]
  );

  const formatCurrencyShort = useCallback(
    (amount) => {
      if (amount === null || amount === undefined) return `${currency?.symbol}0`;
      return `${currency?.symbol}${Number(amount)?.toFixed(0)}`;
    },
    [currency]
  );

  const changeCurrency = useCallback((code) => {
    localStorage.setItem('preferredCurrency', code);
    setCurrencyCode(code);
  }, []);

  return (
    <CurrencyContext.Provider value={{ currency, currencyCode, formatCurrency, formatCurrencyShort, changeCurrency, CURRENCIES }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => {
  const ctx = useContext(CurrencyContext);
  if (!ctx) throw new Error('useCurrency must be used within CurrencyProvider');
  return ctx;
};

export default CurrencyContext;
