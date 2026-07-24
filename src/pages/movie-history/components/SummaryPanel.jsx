import React from 'react';
import Icon from 'components/AppIcon';
import { useCurrency } from 'context/CurrencyContext';

const SummaryPanel = ({ totalCount, filteredCount, totalSpend, selectedCount }) => {
  const { formatCurrency } = useCurrency();

  return (
    <div
      className="flex flex-wrap items-center gap-3 px-4 lg:px-5 py-3"
      style={{ background: 'var(--color-surface-2)', borderBottom: '1px solid var(--color-border)' }}
    >
      <div className="flex items-center gap-2">
        <Icon name="Film" size={15} color="var(--color-primary)" strokeWidth={2} />
        <span className="text-xs" style={{ fontFamily: 'var(--font-caption)', color: 'var(--color-text-secondary)' }}>
          Showing{' '}
          <span style={{ color: 'var(--color-primary)', fontFamily: 'var(--font-data)', fontWeight: 600 }}>
            {filteredCount}
          </span>
          {filteredCount !== totalCount && (
            <> of <span style={{ fontFamily: 'var(--font-data)' }}>{totalCount}</span></>
          )}{' '}
          entries
        </span>
      </div>
      <div className="w-px h-4 hidden sm:block" style={{ background: 'var(--color-border)' }} />
      <div className="flex items-center gap-2">
        <Icon name="Wallet" size={15} color="var(--color-success)" strokeWidth={2} />
        <span className="text-xs" style={{ fontFamily: 'var(--font-caption)', color: 'var(--color-text-secondary)' }}>
          Total spend:{' '}
          <span style={{ color: 'var(--color-success)', fontFamily: 'var(--font-data)', fontWeight: 600 }}>
            {formatCurrency(totalSpend)}
          </span>
        </span>
      </div>
      {selectedCount > 0 && (
        <>
          <div className="w-px h-4 hidden sm:block" style={{ background: 'var(--color-border)' }} />
          <div className="flex items-center gap-2">
            <Icon name="CheckSquare" size={15} color="var(--color-accent)" strokeWidth={2} />
            <span className="text-xs" style={{ fontFamily: 'var(--font-caption)', color: 'var(--color-accent)' }}>
              {selectedCount} selected
            </span>
          </div>
        </>
      )}
    </div>
  );
};

export default SummaryPanel;