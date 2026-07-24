import React from 'react';
import Icon from 'components/AppIcon';
import { useCurrency, CURRENCIES } from 'context/CurrencyContext';

const PREVIEW_ITEMS = [
  { label: 'Total Yearly Spend', amount: 1661.00 },
  { label: 'Avg Cost / Movie', amount: 59.32 },
  { label: 'Ticket Cost', amount: 18.50 },
  { label: 'Food & Drinks', amount: 12.30 },
];

const CurrencySettings = ({ selectedCode, onSelect }) => {
  const { formatCurrency } = useCurrency();

  // For preview, use the selected (not yet saved) currency symbol
  const previewCurrency = CURRENCIES?.find((c) => c?.code === selectedCode) || CURRENCIES?.[0];
  const previewFormat = (amount) => `${previewCurrency?.symbol}${Number(amount)?.toFixed(2)}`;

  return (
    <div
      className="rounded-xl p-5 md:p-6"
      style={{ background: 'var(--color-card)', border: '1px solid var(--color-border)' }}
    >
      {/* Section Header */}
      <div className="flex items-center gap-3 mb-5">
        <div
          className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ background: 'rgba(212,175,55,0.15)', border: '1px solid rgba(212,175,55,0.3)' }}
        >
          <Icon name="Coins" size={18} color="var(--color-primary)" strokeWidth={1.8} />
        </div>
        <div>
          <h2 className="text-base font-semibold" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text-primary)' }}>
            Currency Settings
          </h2>
          <p className="text-xs mt-0.5" style={{ fontFamily: 'var(--font-caption)', color: 'var(--color-text-secondary)' }}>
            Choose how amounts are displayed across the app
          </p>
        </div>
      </div>
      {/* Currency Selector */}
      <div className="mb-5">
        <label className="block text-xs font-semibold mb-2" style={{ fontFamily: 'var(--font-caption)', color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Select Currency
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {CURRENCIES?.map((cur) => (
            <button
              key={cur?.code}
              onClick={() => onSelect(cur?.code)}
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all duration-200"
              style={{
                background: selectedCode === cur?.code ? 'rgba(212,175,55,0.12)' : 'var(--color-surface-2)',
                border: `1px solid ${selectedCode === cur?.code ? 'var(--color-primary)' : 'var(--color-border)'}`,
                boxShadow: selectedCode === cur?.code ? '0 0 0 1px rgba(212,175,55,0.3)' : 'none',
              }}
            >
              <span
                className="w-9 h-9 rounded-md flex items-center justify-center text-base font-bold flex-shrink-0"
                style={{
                  background: selectedCode === cur?.code ? 'rgba(212,175,55,0.2)' : 'var(--color-surface-3)',
                  color: selectedCode === cur?.code ? 'var(--color-primary)' : 'var(--color-text-secondary)',
                  fontFamily: 'var(--font-data)',
                }}
              >
                {cur?.symbol}
              </span>
              <div className="min-w-0">
                <p className="text-sm font-medium" style={{ fontFamily: 'var(--font-caption)', color: 'var(--color-text-primary)' }}>
                  {cur?.name}
                </p>
                <p className="text-xs" style={{ fontFamily: 'var(--font-data)', color: 'var(--color-text-secondary)' }}>
                  {cur?.code} &bull; {cur?.symbol}
                </p>
              </div>
              {selectedCode === cur?.code && (
                <Icon name="CheckCircle2" size={16} color="var(--color-primary)" strokeWidth={2} className="ml-auto flex-shrink-0" />
              )}
            </button>
          ))}
        </div>
      </div>
      {/* Live Preview */}
      <div
        className="rounded-lg p-4"
        style={{ background: 'var(--color-surface-2)', border: '1px solid var(--color-border)' }}
      >
        <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ fontFamily: 'var(--font-caption)', color: 'var(--color-text-secondary)' }}>
          Preview
        </p>
        <div className="grid grid-cols-2 gap-2">
          {PREVIEW_ITEMS?.map((item) => (
            <div
              key={item?.label}
              className="rounded-md p-3"
              style={{ background: 'var(--color-card)', border: '1px solid var(--color-border)' }}
            >
              <p className="text-xs mb-1" style={{ fontFamily: 'var(--font-caption)', color: 'var(--color-text-secondary)' }}>
                {item?.label}
              </p>
              <p className="text-base font-bold" style={{ fontFamily: 'var(--font-data)', color: 'var(--color-primary)' }}>
                {previewFormat(item?.amount)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CurrencySettings;
