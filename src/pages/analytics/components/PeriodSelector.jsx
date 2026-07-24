import React from 'react';

const periods = [
  { value: 'month', label: 'This Month' },
  { value: 'year', label: 'This Year' },
  { value: 'all', label: 'All Time' },
];

const PeriodSelector = ({ selected, onChange }) => {
  return (
    <div className="flex items-center gap-1 p-1 rounded-lg overflow-x-auto" style={{ background: 'var(--color-surface-2)', border: '1px solid var(--color-border)' }}>
      {periods?.map((p) => (
        <button
          key={p?.value}
          onClick={() => onChange(p?.value)}
          className="flex-shrink-0 px-3 py-1.5 rounded-md text-xs font-medium transition-all whitespace-nowrap"
          style={{
            background: selected === p?.value ? 'var(--color-card)' : 'transparent',
            color: selected === p?.value ? 'var(--color-primary)' : 'var(--color-text-secondary)',
            boxShadow: selected === p?.value ? 'var(--shadow-sm)' : 'none',
            fontFamily: 'var(--font-caption)',
            border: selected === p?.value ? '1px solid var(--color-border)' : '1px solid transparent'
          }}
        >
          {p?.label}
        </button>
      ))}
    </div>
  );
};

export default PeriodSelector;