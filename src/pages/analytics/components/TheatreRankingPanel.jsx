import React from 'react';
import { useCurrency } from 'context/CurrencyContext';
import Icon from 'components/AppIcon';

const MONTH_NAMES_SHORT = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const CURRENT_YEAR = new Date()?.getFullYear();

const TheatreRankingPanel = ({ year = CURRENT_YEAR, period = 'year', month = new Date()?.getMonth(), theatres = [] }) => {
  const { formatCurrency } = useCurrency();

  let subtitle;
  if (period === 'month') subtitle = `${MONTH_NAMES_SHORT?.[month]} ${year} — Ranked by visits`;
  else if (period === 'all') subtitle = 'All years — Ranked by total visits';
  else subtitle = `${year} — Ranked by number of visits`;

  const maxVisits = theatres?.length > 0 ? Math.max(...theatres?.map((t) => t?.visits)) : 1;

  return (
    <div className="rounded-xl p-4 md:p-6 h-full" style={{ background: 'var(--color-card)', border: '1px solid var(--color-border)' }}>
      <div className="mb-5">
        <h3 className="text-base md:text-lg font-semibold" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text-primary)' }}>
          Most Visited Theatres
        </h3>
        <p className="text-xs mt-0.5" style={{ color: 'var(--color-text-secondary)', fontFamily: 'var(--font-caption)' }}>
          {subtitle}
        </p>
      </div>
      {theatres?.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-10 gap-3">
          <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: 'rgba(212,175,55,0.08)', border: '1px solid rgba(212,175,55,0.18)' }}>
            <Icon name="MapPin" size={22} color="var(--color-text-secondary)" strokeWidth={1.5} />
          </div>
          <div className="text-center">
            <p className="text-sm font-medium mb-1" style={{ color: 'var(--color-text-primary)', fontFamily: 'var(--font-caption)' }}>No theatre data yet</p>
            <p className="text-xs max-w-[180px]" style={{ color: 'var(--color-text-secondary)', fontFamily: 'var(--font-caption)' }}>Add movie entries with a theatre name to see your top venues here</p>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {theatres?.map((theatre, idx) => (
            <div key={theatre?.name}>
              <div className="flex items-start justify-between gap-2 mb-1.5">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-xs font-bold w-5 flex-shrink-0" style={{ fontFamily: 'var(--font-data)', color: idx === 0 ? 'var(--color-primary)' : 'var(--color-text-secondary)' }}>
                    #{idx + 1}
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate" style={{ color: 'var(--color-text-primary)', fontFamily: 'var(--font-caption)' }}>{theatre?.name}</p>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-sm font-semibold whitespace-nowrap" style={{ color: 'var(--color-text-primary)', fontFamily: 'var(--font-data)' }}>{formatCurrency(theatre?.spent)}</p>
                  <p className="text-xs whitespace-nowrap" style={{ color: 'var(--color-text-secondary)', fontFamily: 'var(--font-caption)' }}>{theatre?.visits} visit{theatre?.visits !== 1 ? 's' : ''}</p>
                </div>
              </div>
              <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--color-surface-2)' }}>
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${(theatre?.visits / maxVisits) * 100}%`,
                    background: idx === 0 ? 'linear-gradient(90deg, var(--color-primary), var(--color-accent))' : 'var(--color-secondary)',
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

export default TheatreRankingPanel;