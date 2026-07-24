import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import Icon from 'components/AppIcon';

const MONTH_NAMES_SHORT = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const CURRENT_YEAR = new Date()?.getFullYear();

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload?.length) {
    return (
      <div className="rounded-lg p-2 border text-xs" style={{ background: 'var(--color-surface-2)', borderColor: 'var(--color-border)', fontFamily: 'var(--font-caption)' }}>
        <p style={{ color: 'var(--color-text-primary)' }}>{label}: <span style={{ color: 'var(--color-primary)' }}>{payload?.[0]?.value} movies</span></p>
      </div>
    );
  }
  return null;
};

const PeakViewingPatterns = ({ year = CURRENT_YEAR, period = 'year', month = new Date()?.getMonth(), dayData = [], timeData = [] }) => {
  let subtitle;
  if (period === 'month') subtitle = `${MONTH_NAMES_SHORT?.[month]} ${year} — When you watch movies most`;
  else if (period === 'all') subtitle = 'All years — When you watch movies most';
  else subtitle = `${year} — When you watch movies most`;

  const hasDayData = dayData?.some((d) => d?.movies > 0);
  const hasTimeData = timeData?.some((d) => d?.movies > 0);
  const hasAnyData = hasDayData || hasTimeData;

  return (
    <div className="rounded-xl p-4 md:p-6" style={{ background: 'var(--color-card)', border: '1px solid var(--color-border)' }}>
      <div className="mb-5">
        <h3 className="text-base md:text-lg font-semibold" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text-primary)' }}>
          Peak Viewing Patterns
        </h3>
        <p className="text-xs mt-0.5" style={{ color: 'var(--color-text-secondary)', fontFamily: 'var(--font-caption)' }}>
          {subtitle}
        </p>
      </div>
      {!hasAnyData ? (
        <div className="flex flex-col items-center justify-center py-10 gap-3">
          <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: 'rgba(212,175,55,0.08)', border: '1px solid rgba(212,175,55,0.18)' }}>
            <Icon name="CalendarClock" size={22} color="var(--color-text-secondary)" strokeWidth={1.5} />
          </div>
          <div className="text-center">
            <p className="text-sm font-medium mb-1" style={{ color: 'var(--color-text-primary)', fontFamily: 'var(--font-caption)' }}>No viewing patterns yet</p>
            <p className="text-xs max-w-[200px]" style={{ color: 'var(--color-text-secondary)', fontFamily: 'var(--font-caption)' }}>Add entries with show times and dates to discover when you watch movies most</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-xs font-medium mb-3" style={{ color: 'var(--color-text-secondary)', fontFamily: 'var(--font-caption)' }}>By Day of Week</p>
            <div className="w-full h-36">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dayData} margin={{ top: 0, right: 0, left: -24, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(212,175,55,0.08)" />
                  <XAxis dataKey="day" tick={{ fill: 'var(--color-text-secondary)', fontSize: 10, fontFamily: 'var(--font-caption)' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: 'var(--color-text-secondary)', fontSize: 10, fontFamily: 'var(--font-data)' }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="movies" fill="#D4AF37" radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div>
            <p className="text-xs font-medium mb-3" style={{ color: 'var(--color-text-secondary)', fontFamily: 'var(--font-caption)' }}>By Time of Day</p>
            <div className="w-full h-36">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={timeData} margin={{ top: 0, right: 0, left: -24, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(212,175,55,0.08)" />
                  <XAxis dataKey="slot" tick={{ fill: 'var(--color-text-secondary)', fontSize: 10, fontFamily: 'var(--font-caption)' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: 'var(--color-text-secondary)', fontSize: 10, fontFamily: 'var(--font-data)' }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="movies" fill="#FF6B6B" radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PeakViewingPatterns;