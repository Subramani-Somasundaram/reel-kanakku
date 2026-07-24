import React, { useState } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import Icon from 'components/AppIcon';
import { useCurrency } from 'context/CurrencyContext';

const MONTH_NAMES_SHORT = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const CURRENT_YEAR = new Date()?.getFullYear();

const SpendingBreakdownChart = ({ period, year = CURRENT_YEAR, month = new Date()?.getMonth(), data }) => {
  const [chartType, setChartType] = useState('bar');
  const { formatCurrency } = useCurrency();

  let chartData, subtitle;
  if (period === 'month') {
    const d = data || { tickets: 0, food: 0, parking: 0, total: 0 };
    chartData = [{ month: MONTH_NAMES_SHORT?.[month], tickets: d?.tickets || 0, food: d?.food || 0, parking: d?.parking || 0, total: d?.total || 0 }];
    subtitle = `${MONTH_NAMES_SHORT?.[month]} ${year} — spending breakdown`;
  } else {
    chartData = data || [];
    subtitle = period === 'all' ? 'All years combined — monthly totals' : `Tickets, food & parking costs — ${year}`;
  }

  const hasData = chartData?.some((d) => (d?.total || 0) > 0);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload?.length) {
      return (
        <div className="rounded-lg p-3 border text-xs" style={{ background: 'var(--color-surface-2)', borderColor: 'var(--color-border)', fontFamily: 'var(--font-caption)' }}>
          <p className="font-semibold mb-2" style={{ color: 'var(--color-text-primary)' }}>{label}</p>
          {payload?.map((entry) => (
            <p key={entry?.name} style={{ color: entry?.color }}>
              {entry?.name?.charAt(0)?.toUpperCase() + entry?.name?.slice(1)}: {formatCurrency(entry?.value)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="rounded-xl p-4 md:p-6" style={{ background: 'var(--color-card)', border: '1px solid var(--color-border)' }}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h3 className="text-base md:text-lg font-semibold" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text-primary)' }}>
            Monthly Spending Breakdown
          </h3>
          <p className="text-xs mt-0.5" style={{ color: 'var(--color-text-secondary)', fontFamily: 'var(--font-caption)' }}>
            {subtitle}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setChartType('bar')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all"
            style={{
              background: chartType === 'bar' ? 'rgba(212,175,55,0.15)' : 'var(--color-surface-2)',
              color: chartType === 'bar' ? 'var(--color-primary)' : 'var(--color-text-secondary)',
              border: `1px solid ${chartType === 'bar' ? 'var(--color-primary)' : 'var(--color-border)'}`,
              fontFamily: 'var(--font-caption)'
            }}
          >
            <Icon name="BarChart2" size={13} />
            Bar
          </button>
          <button
            onClick={() => setChartType('line')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all"
            style={{
              background: chartType === 'line' ? 'rgba(212,175,55,0.15)' : 'var(--color-surface-2)',
              color: chartType === 'line' ? 'var(--color-primary)' : 'var(--color-text-secondary)',
              border: `1px solid ${chartType === 'line' ? 'var(--color-primary)' : 'var(--color-border)'}`,
              fontFamily: 'var(--font-caption)'
            }}
          >
            <Icon name="TrendingUp" size={13} />
            Line
          </button>
        </div>
      </div>
      {!hasData ? (
        <div className="flex flex-col items-center justify-center h-56 gap-3">
          <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: 'rgba(212,175,55,0.08)', border: '1px solid rgba(212,175,55,0.18)' }}>
            <Icon name="BarChart2" size={22} color="var(--color-text-secondary)" strokeWidth={1.5} />
          </div>
          <div className="text-center">
            <p className="text-sm font-medium mb-1" style={{ color: 'var(--color-text-primary)', fontFamily: 'var(--font-caption)' }}>No spending data yet</p>
            <p className="text-xs max-w-[200px]" style={{ color: 'var(--color-text-secondary)', fontFamily: 'var(--font-caption)' }}>Start logging movie entries with costs to see your spending trends here</p>
          </div>
        </div>
      ) : (
        <div className="w-full h-56 md:h-72">
          <ResponsiveContainer width="100%" height="100%">
            {chartType === 'bar' ? (
              <BarChart data={chartData} margin={{ top: 4, right: 4, left: -16, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(212,175,55,0.1)" />
                <XAxis dataKey="month" tick={{ fill: 'var(--color-text-secondary)', fontSize: 11, fontFamily: 'var(--font-caption)' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: 'var(--color-text-secondary)', fontSize: 11, fontFamily: 'var(--font-data)' }} axisLine={false} tickLine={false} tickFormatter={(v) => formatCurrency(v)} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontFamily: 'var(--font-caption)', fontSize: 12, color: 'var(--color-text-secondary)' }} />
                <Bar dataKey="tickets" fill="#D4AF37" radius={[3, 3, 0, 0]} />
                <Bar dataKey="food" fill="#FF6B6B" radius={[3, 3, 0, 0]} />
                <Bar dataKey="parking" fill="#4ECDC4" radius={[3, 3, 0, 0]} />
              </BarChart>
            ) : (
              <LineChart data={chartData} margin={{ top: 4, right: 4, left: -16, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(212,175,55,0.1)" />
                <XAxis dataKey="month" tick={{ fill: 'var(--color-text-secondary)', fontSize: 11, fontFamily: 'var(--font-caption)' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: 'var(--color-text-secondary)', fontSize: 11, fontFamily: 'var(--font-data)' }} axisLine={false} tickLine={false} tickFormatter={(v) => formatCurrency(v)} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontFamily: 'var(--font-caption)', fontSize: 12, color: 'var(--color-text-secondary)' }} />
                <Line type="monotone" dataKey="total" stroke="#D4AF37" strokeWidth={2.5} dot={{ fill: '#D4AF37', r: 4 }} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="tickets" stroke="#FF6B6B" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="food" stroke="#4ECDC4" strokeWidth={2} dot={false} />
              </LineChart>
            )}
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default SpendingBreakdownChart;