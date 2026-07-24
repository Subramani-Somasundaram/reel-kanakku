import React from 'react';
import Icon from 'components/AppIcon';

const MONTH_NAMES_SHORT = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const CURRENT_YEAR = new Date()?.getFullYear();

const COMPANION_COLORS = [
  'var(--color-primary)',
  'var(--color-accent)',
  'var(--color-success)',
  '#F97316',
  '#A78BFA',
  '#38BDF8',
  '#FB7185',
  '#34D399',
];

const CompanionsPanel = ({ year = CURRENT_YEAR, period = 'year', month = new Date()?.getMonth(), companions = [] }) => {
  let subtitle;
  if (period === 'month') subtitle = `${MONTH_NAMES_SHORT?.[month]} ${year} — Ranked by movies watched`;
  else if (period === 'all') subtitle = 'All years — Ranked by movies watched together';
  else subtitle = `${year} — Ranked by movies watched together`;

  const maxCount = companions?.length > 0 ? Math.max(...companions?.map((c) => c?.count)) : 1;

  return (
    <div className="rounded-xl p-4 md:p-6" style={{ background: 'var(--color-card)', border: '1px solid var(--color-border)' }}>
      <div className="mb-5">
        <div className="flex items-center gap-2 mb-1">
          <Icon name="Users" size={16} color="var(--color-primary)" strokeWidth={1.8} />
          <h3 className="text-base md:text-lg font-semibold" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text-primary)' }}>
            Movies by Companion
          </h3>
        </div>
        <p className="text-xs mt-0.5" style={{ color: 'var(--color-text-secondary)', fontFamily: 'var(--font-caption)' }}>
          {subtitle}
        </p>
      </div>

      {companions?.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-10 gap-3">
          <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: 'rgba(212,175,55,0.08)', border: '1px solid rgba(212,175,55,0.18)' }}>
            <Icon name="UserPlus" size={22} color="var(--color-text-secondary)" strokeWidth={1.5} />
          </div>
          <div className="text-center">
            <p className="text-sm font-medium mb-1" style={{ color: 'var(--color-text-primary)', fontFamily: 'var(--font-caption)' }}>No companion data yet</p>
            <p className="text-xs max-w-[180px]" style={{ color: 'var(--color-text-secondary)', fontFamily: 'var(--font-caption)' }}>Add movie entries with companions to see who you watch movies with most</p>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {companions?.map((companion, idx) => (
            <div key={companion?.name}>
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <div className="flex items-center gap-2 min-w-0">
                  <span
                    className="text-xs font-bold w-5 flex-shrink-0"
                    style={{ fontFamily: 'var(--font-data)', color: idx === 0 ? 'var(--color-primary)' : 'var(--color-text-secondary)' }}
                  >
                    #{idx + 1}
                  </span>
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold"
                    style={{
                      background: `${COMPANION_COLORS?.[idx % COMPANION_COLORS?.length]}22`,
                      color: COMPANION_COLORS?.[idx % COMPANION_COLORS?.length],
                      fontFamily: 'var(--font-data)',
                      border: `1px solid ${COMPANION_COLORS?.[idx % COMPANION_COLORS?.length]}44`
                    }}
                  >
                    {companion?.name?.charAt(0)?.toUpperCase()}
                  </div>
                  <p className="text-sm font-medium truncate" style={{ color: 'var(--color-text-primary)', fontFamily: 'var(--font-caption)' }}>
                    {companion?.name}
                  </p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-sm font-semibold whitespace-nowrap" style={{ color: 'var(--color-text-primary)', fontFamily: 'var(--font-data)' }}>
                    {companion?.count}
                  </p>
                  <p className="text-xs whitespace-nowrap" style={{ color: 'var(--color-text-secondary)', fontFamily: 'var(--font-caption)' }}>
                    movie{companion?.count !== 1 ? 's' : ''}
                  </p>
                </div>
              </div>
              <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--color-surface-2)' }}>
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${(companion?.count / maxCount) * 100}%`,
                    background: idx === 0
                      ? 'linear-gradient(90deg, var(--color-primary), var(--color-accent))'
                      : COMPANION_COLORS?.[idx % COMPANION_COLORS?.length],
                    boxShadow: idx === 0 ? 'var(--shadow-golden)' : 'none'
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CompanionsPanel;
