import React from 'react';
import Icon from 'components/AppIcon';

const DisplayPreferences = ({ dateFormat, onDateFormatChange, numberFormat, onNumberFormatChange }) => {
  return (
    <div
      className="rounded-xl p-5 md:p-6"
      style={{ background: 'var(--color-card)', border: '1px solid var(--color-border)' }}
    >
      <div className="flex items-center gap-3 mb-5">
        <div
          className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ background: 'rgba(78,205,196,0.12)', border: '1px solid rgba(78,205,196,0.3)' }}
        >
          <Icon name="SlidersHorizontal" size={18} color="var(--color-success)" strokeWidth={1.8} />
        </div>
        <div>
          <h2 className="text-base font-semibold" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text-primary)' }}>
            Display Preferences
          </h2>
          <p className="text-xs mt-0.5" style={{ fontFamily: 'var(--font-caption)', color: 'var(--color-text-secondary)' }}>
            Customize date and number formatting
          </p>
        </div>
      </div>
      <div className="space-y-4">
        {/* Date Format */}
        <div>
          <label className="block text-xs font-semibold mb-2" style={{ fontFamily: 'var(--font-caption)', color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Date Format
          </label>
          <div className="flex flex-wrap gap-2">
            {['MM/DD/YYYY', 'DD/MM/YYYY', 'YYYY-MM-DD']?.map((fmt) => (
              <button
                key={fmt}
                onClick={() => onDateFormatChange(fmt)}
                className="px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200"
                style={{
                  background: dateFormat === fmt ? 'rgba(212,175,55,0.15)' : 'var(--color-surface-2)',
                  border: `1px solid ${dateFormat === fmt ? 'var(--color-primary)' : 'var(--color-border)'}`,
                  color: dateFormat === fmt ? 'var(--color-primary)' : 'var(--color-text-secondary)',
                  fontFamily: 'var(--font-data)',
                }}
              >
                {fmt}
              </button>
            ))}
          </div>
        </div>

        {/* Number Format */}
        <div>
          <label className="block text-xs font-semibold mb-2" style={{ fontFamily: 'var(--font-caption)', color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Number Format
          </label>
          <div className="flex flex-wrap gap-2">
            {[
              { label: '1,234.56', value: 'en' },
              { label: '1.234,56', value: 'de' },
            ]?.map((opt) => (
              <button
                key={opt?.value}
                onClick={() => onNumberFormatChange(opt?.value)}
                className="px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200"
                style={{
                  background: numberFormat === opt?.value ? 'rgba(212,175,55,0.15)' : 'var(--color-surface-2)',
                  border: `1px solid ${numberFormat === opt?.value ? 'var(--color-primary)' : 'var(--color-border)'}`,
                  color: numberFormat === opt?.value ? 'var(--color-primary)' : 'var(--color-text-secondary)',
                  fontFamily: 'var(--font-data)',
                }}
              >
                {opt?.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DisplayPreferences;
