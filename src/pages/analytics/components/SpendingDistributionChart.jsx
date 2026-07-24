import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useCurrency } from 'context/CurrencyContext';
import Icon from 'components/AppIcon';

const MONTH_NAMES_SHORT = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const CURRENT_YEAR = new Date()?.getFullYear();

const SpendingDistributionChart = ({ year = CURRENT_YEAR, period = 'year', month = new Date()?.getMonth(), distributionData = [] }) => {
  const { formatCurrency } = useCurrency();

  let subtitle;
  if (period === 'month') subtitle = `${MONTH_NAMES_SHORT?.[month]} ${year}`;
  else if (period === 'all') subtitle = 'All years combined';
  else subtitle = String(year);

  const total = distributionData?.reduce((s, d) => s + (d?.value || 0), 0);
  const hasData = total > 0;

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload?.length) {
      const item = payload?.[0];
      return (
        <div className="rounded-lg p-3 border text-xs" style={{ background: 'var(--color-surface-2)', borderColor: 'var(--color-border)', fontFamily: 'var(--font-caption)' }}>
          <p style={{ color: item?.payload?.color, fontWeight: 600 }}>{item?.name}</p>
          <p style={{ color: 'var(--color-text-primary)' }}>{formatCurrency(item?.value)}</p>
          <p style={{ color: 'var(--color-text-secondary)' }}>{total > 0 ? ((item?.value / total) * 100)?.toFixed(1) : 0}%</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="rounded-xl p-4 md:p-6 h-full" style={{ background: 'var(--color-card)', border: '1px solid var(--color-border)' }}>
      <div className="mb-4">
        <h3 className="text-base md:text-lg font-semibold" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text-primary)' }}>
          Spending Distribution
        </h3>
        <p className="text-xs mt-0.5" style={{ color: 'var(--color-text-secondary)', fontFamily: 'var(--font-caption)' }}>
          {subtitle} — Total: {formatCurrency(total)}
        </p>
      </div>
      {!hasData ? (
        <div className="flex flex-col items-center justify-center h-48 gap-3">
          <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: 'rgba(212,175,55,0.08)', border: '1px solid rgba(212,175,55,0.18)' }}>
            <Icon name="PieChart" size={22} color="var(--color-text-secondary)" strokeWidth={1.5} />
          </div>
          <div className="text-center">
            <p className="text-sm font-medium mb-1" style={{ color: 'var(--color-text-primary)', fontFamily: 'var(--font-caption)' }}>No spending data yet</p>
            <p className="text-xs max-w-[180px]" style={{ color: 'var(--color-text-secondary)', fontFamily: 'var(--font-caption)' }}>Add entries with cost details to see how your spending is distributed</p>
          </div>
        </div>
      ) : (
        <>
          <div className="w-full h-48 md:h-56">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={distributionData} cx="50%" cy="50%" innerRadius="50%" outerRadius="75%" paddingAngle={3} dataKey="value">
                  {distributionData?.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry?.color} stroke="transparent" />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  iconType="circle"
                  iconSize={8}
                  wrapperStyle={{ fontFamily: 'var(--font-caption)', fontSize: 11, color: 'var(--color-text-secondary)' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-2 mt-2">
            {distributionData?.map((item) => (
              <div key={item?.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: item?.color }} />
                  <span className="text-xs" style={{ color: 'var(--color-text-secondary)', fontFamily: 'var(--font-caption)' }}>{item?.name}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs" style={{ color: 'var(--color-text-secondary)', fontFamily: 'var(--font-data)' }}>
                    {total > 0 ? ((item?.value / total) * 100)?.toFixed(1) : 0}%
                  </span>
                  <span className="text-xs font-medium" style={{ color: 'var(--color-text-primary)', fontFamily: 'var(--font-data)', minWidth: 48, textAlign: 'right' }}>
                    {formatCurrency(item?.value)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default SpendingDistributionChart;