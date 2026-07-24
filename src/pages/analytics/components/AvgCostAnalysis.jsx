import React from 'react';
import Icon from 'components/AppIcon';
import { useCurrency } from 'context/CurrencyContext';

const MONTH_NAMES_SHORT = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const CURRENT_YEAR = new Date()?.getFullYear();

const AvgCostAnalysis = ({ year = CURRENT_YEAR, period = 'year', month = new Date()?.getMonth(), costItems = [] }) => {
  const { formatCurrency } = useCurrency();

  let subtitle;
  if (period === 'month') subtitle = `${MONTH_NAMES_SHORT?.[month]} ${year} — Per-movie cost breakdown`;
  else if (period === 'all') subtitle = 'All years — Average per-movie cost';
  else subtitle = `${year} — Per-movie cost breakdown`;

  const hasData = costItems?.some((item) => (item?.value || 0) > 0);

  return (
    <div className="rounded-xl p-4 md:p-6" style={{ background: 'var(--color-card)', border: '1px solid var(--color-border)' }}>
      <div className="mb-5">
        <h3 className="text-base md:text-lg font-semibold" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text-primary)' }}>
          Average Cost Analysis
        </h3>
        <p className="text-xs mt-0.5" style={{ color: 'var(--color-text-secondary)', fontFamily: 'var(--font-caption)' }}>
          {subtitle}
        </p>
      </div>
      {!hasData ? (
        <div className="flex flex-col items-center justify-center py-8 gap-3">
          <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: 'rgba(212,175,55,0.08)', border: '1px solid rgba(212,175,55,0.18)' }}>
            <Icon name="TrendingUp" size={22} color="var(--color-text-secondary)" strokeWidth={1.5} />
          </div>
          <div className="text-center">
            <p className="text-sm font-medium mb-1" style={{ color: 'var(--color-text-primary)', fontFamily: 'var(--font-caption)' }}>No cost data yet</p>
            <p className="text-xs max-w-[200px]" style={{ color: 'var(--color-text-secondary)', fontFamily: 'var(--font-caption)' }}>Log movie entries with ticket and food costs to see your average spend per visit</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {costItems?.map((item) => (
            <div key={item?.label} className="rounded-lg p-3" style={{ background: 'var(--color-surface-2)', border: '1px solid var(--color-border)' }}>
              <div className="flex items-center justify-between mb-2">
                <Icon name={item?.icon} size={15} color={item?.color} strokeWidth={2} />
              </div>
              <p className="text-base md:text-lg font-bold" style={{ fontFamily: 'var(--font-data)', color: 'var(--color-text-primary)' }}>
                {formatCurrency(item?.value)}
              </p>
              <p className="text-xs mt-0.5 line-clamp-2" style={{ color: 'var(--color-text-secondary)', fontFamily: 'var(--font-caption)' }}>{item?.label}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AvgCostAnalysis;