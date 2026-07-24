import React from 'react';
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, Tooltip } from 'recharts';
import Icon from 'components/AppIcon';

const MONTH_NAMES_SHORT = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const CURRENT_YEAR = new Date()?.getFullYear();

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload?.length) {
    return (
      <div className="rounded-lg p-2 border text-xs" style={{ background: 'var(--color-surface-2)', borderColor: 'var(--color-border)', fontFamily: 'var(--font-caption)' }}>
        <p style={{ color: 'var(--color-primary)' }}>{payload?.[0]?.payload?.subject}: {payload?.[0]?.value} movies</p>
      </div>
    );
  }
  return null;
};

const LanguagePreferencePanel = ({ year = CURRENT_YEAR, period = 'year', month = new Date()?.getMonth(), languages = [] }) => {
  let subtitle;
  if (period === 'month') subtitle = `${MONTH_NAMES_SHORT?.[month]} ${year} — Movies watched by language`;
  else if (period === 'all') subtitle = 'All years — Movies watched by language';
  else subtitle = `${year} — Movies watched by language`;

  const radarData = languages?.map((l) => ({ subject: l?.language ? l?.language?.charAt(0)?.toUpperCase() + l?.language?.slice(1) : l?.language, count: l?.count }));

  return (
    <div className="rounded-xl p-4 md:p-6 h-full" style={{ background: 'var(--color-card)', border: '1px solid var(--color-border)' }}>
      <div className="mb-4">
        <h3 className="text-base md:text-lg font-semibold" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text-primary)' }}>
          Language Preferences
        </h3>
        <p className="text-xs mt-0.5" style={{ color: 'var(--color-text-secondary)', fontFamily: 'var(--font-caption)' }}>
          {subtitle}
        </p>
      </div>
      {languages?.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-40 gap-3">
          <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: 'rgba(212,175,55,0.08)', border: '1px solid rgba(212,175,55,0.18)' }}>
            <Icon name="Languages" size={22} color="var(--color-text-secondary)" strokeWidth={1.5} />
          </div>
          <div className="text-center">
            <p className="text-sm font-medium mb-1" style={{ color: 'var(--color-text-primary)', fontFamily: 'var(--font-caption)' }}>No language data yet</p>
            <p className="text-xs max-w-[180px]" style={{ color: 'var(--color-text-secondary)', fontFamily: 'var(--font-caption)' }}>Add movie entries with a language to track your viewing preferences</p>
          </div>
        </div>
      ) : (
        <>
          <div className="w-full h-40 md:h-48">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid stroke="rgba(212,175,55,0.15)" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: 'var(--color-text-secondary)', fontSize: 10, fontFamily: 'var(--font-caption)' }} />
                <Radar name="Movies" dataKey="count" stroke="#D4AF37" fill="#D4AF37" fillOpacity={0.25} strokeWidth={2} />
                <Tooltip content={<CustomTooltip />} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-2 mt-2">
            {languages?.map((lang) => (
              <div key={lang?.language} className="flex items-center gap-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium" style={{ color: 'var(--color-text-primary)', fontFamily: 'var(--font-caption)' }}>{lang?.language ? lang?.language?.charAt(0)?.toUpperCase() + lang?.language?.slice(1) : ''}</span>
                    <span className="text-xs" style={{ color: 'var(--color-text-secondary)', fontFamily: 'var(--font-data)' }}>{lang?.count} ({lang?.percent}%)</span>
                  </div>
                  <div className="w-full h-1 rounded-full overflow-hidden" style={{ background: 'var(--color-surface-2)' }}>
                    <div className="h-full rounded-full" style={{ width: `${lang?.percent}%`, background: 'var(--color-primary)' }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default LanguagePreferencePanel;