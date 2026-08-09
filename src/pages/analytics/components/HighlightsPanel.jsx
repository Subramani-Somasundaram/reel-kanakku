import React, { useMemo } from 'react';
import Icon from 'components/AppIcon';
import { useCurrency } from 'context/CurrencyContext';

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const fmtDate = (dateStr) => {
  if (!dateStr) return '';
  const [y, m, d] = String(dateStr)?.split('-');
  return `${parseInt(d, 10)} ${MONTH_NAMES?.[parseInt(m, 10) - 1]?.slice(0, 3)} ${y}`;
};

const periodLabel = (period, year, month) => {
  if (period === 'month') return `${MONTH_NAMES?.[month]} ${year}`;
  if (period === 'year') return String(year);
  return 'All time';
};

const HighlightsPanel = ({ entries = [], period = 'all', year, month }) => {
  const { formatCurrency } = useCurrency();

  const data = useMemo(() => {
    const rows = (entries || [])?.filter((e) => e?.watch_date);
    const total = rows?.length;
    if (total === 0) return null;

    // ── Solo ratio ────────────────────────────────────────────────
    const solo = rows?.filter(
      (e) => (e?.companions || '')?.trim()?.toLowerCase() === 'alone'
    )?.length;
    const soloPct = Math.round((solo / total) * 100);

    // ── Biggest / cheapest outing ─────────────────────────────────
    const withCost = rows?.map((e) => ({
      name: e?.movie_name,
      theatre: e?.theatre,
      date: e?.watch_date,
      cost: parseFloat(e?.total_cost) || 0,
    }));
    const sorted = [...withCost]?.sort((a, b) => b?.cost - a?.cost);
    const biggest = sorted?.[0];
    const paid = sorted?.filter((r) => r?.cost > 0);
    const cheapest = paid?.length > 0 ? paid?.[paid?.length - 1] : null;
    const freeCount = withCost?.filter((r) => r?.cost === 0)?.length;

    // ── Rewatches ─────────────────────────────────────────────────
    const titleMap = {};
    rows?.forEach((e) => {
      const key = (e?.movie_name || '')?.trim();
      if (!key) return;
      if (!titleMap?.[key]) titleMap[key] = { name: key, count: 0, dates: [] };
      titleMap[key].count += 1;
      titleMap[key]?.dates?.push(e?.watch_date);
    });
    const rewatched = Object.values(titleMap)
      ?.filter((t) => t?.count > 1)
      ?.sort((a, b) => b?.count - a?.count || a?.name?.localeCompare(b?.name));
    const rewatchViewings = rewatched?.reduce((s, t) => s + t?.count, 0);

    return {
      total, solo, soloPct,
      biggest, cheapest, freeCount,
      rewatched, rewatchViewings,
      uniqueTitles: Object.keys(titleMap)?.length,
    };
  }, [entries]);

  const label = periodLabel(period, year, month);

  if (!data) {
    return (
      <div
        className="rounded-xl p-4 md:p-5"
        style={{
          background: 'var(--color-card)',
          border: '1px solid var(--color-border)',
          boxShadow: 'var(--shadow-md)',
        }}
      >
        <div className="flex items-center gap-2 mb-3">
          <Icon name="Sparkles" size={18} color="var(--color-primary)" strokeWidth={1.8} />
          <h3 className="text-base font-semibold" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text-primary)' }}>
            Highlights
          </h3>
        </div>
        <p className="text-sm py-6 text-center" style={{ fontFamily: 'var(--font-caption)', color: 'var(--color-text-secondary)' }}>
          Nothing logged for {label} yet.
        </p>
      </div>
    );
  }

  const Stat = ({ icon, iconColor, title, value, sub, valueColor }) => (
    <div
      className="rounded-lg p-3.5"
      style={{ background: 'var(--color-surface-2)', border: '1px solid var(--color-border)' }}
    >
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-xs" style={{ fontFamily: 'var(--font-caption)', color: 'var(--color-text-secondary)' }}>
          {title}
        </span>
        <Icon name={icon} size={14} color={iconColor} strokeWidth={1.8} />
      </div>
      <p
        className="text-xl font-bold leading-tight"
        style={{ fontFamily: 'var(--font-data)', color: valueColor || 'var(--color-text-primary)' }}
      >
        {value}
      </p>
      {sub && (
        <p className="text-xs mt-1" style={{ fontFamily: 'var(--font-caption)', color: 'var(--color-text-secondary)' }}>
          {sub}
        </p>
      )}
    </div>
  );

  return (
    <div
      className="rounded-xl p-4 md:p-5"
      style={{
        background: 'var(--color-card)',
        border: '1px solid var(--color-border)',
        boxShadow: 'var(--shadow-md)',
      }}
    >
      <div className="flex items-center gap-2 mb-1">
        <Icon name="Sparkles" size={18} color="var(--color-primary)" strokeWidth={1.8} />
        <h3 className="text-base font-semibold" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text-primary)' }}>
          Highlights
        </h3>
        <span
          className="ml-auto text-xs px-2 py-0.5 rounded-full"
          style={{ background: 'rgba(212,175,55,0.12)', color: 'var(--color-primary)', fontFamily: 'var(--font-caption)' }}
        >
          {label}
        </span>
      </div>
      <p className="text-xs mb-4" style={{ fontFamily: 'var(--font-caption)', color: 'var(--color-text-secondary)' }}>
        {data?.total} {data?.total === 1 ? 'film' : 'films'} &middot; {data?.uniqueTitles} unique {data?.uniqueTitles === 1 ? 'title' : 'titles'}
      </p>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Stat
          icon="User"
          iconColor="var(--color-accent)"
          title="Watched alone"
          value={`${data?.soloPct}%`}
          sub={`${data?.solo} of ${data?.total}`}
          valueColor="var(--color-accent)"
        />
        <Stat
          icon="TrendingUp"
          iconColor="var(--color-primary)"
          title="Biggest outing"
          value={formatCurrency(data?.biggest?.cost)}
          sub={`${data?.biggest?.name} · ${fmtDate(data?.biggest?.date)}`}
          valueColor="var(--color-primary)"
        />
        <Stat
          icon="TrendingDown"
          iconColor="var(--color-success)"
          title="Cheapest paid"
          value={data?.cheapest ? formatCurrency(data?.cheapest?.cost) : '—'}
          sub={
            data?.cheapest
              ? `${data?.cheapest?.name} · ${fmtDate(data?.cheapest?.date)}`
              : 'No paid entries'
          }
          valueColor="var(--color-success)"
        />
        <Stat
          icon="Repeat"
          iconColor="var(--color-secondary)"
          title="Rewatched"
          value={data?.rewatched?.length}
          sub={
            data?.rewatched?.length > 0
              ? `${data?.rewatchViewings} viewings`
              : 'None repeated'
          }
          valueColor="var(--color-secondary)"
        />
      </div>

      {data?.freeCount > 0 && (
        <p className="text-xs mt-3" style={{ fontFamily: 'var(--font-caption)', color: 'var(--color-text-secondary)' }}>
          {data?.freeCount} {data?.freeCount === 1 ? 'film' : 'films'} cost nothing.
        </p>
      )}

      {data?.rewatched?.length > 0 && (
        <div className="mt-4 pt-4" style={{ borderTop: '1px solid var(--color-border)' }}>
          <p className="text-xs mb-2.5" style={{ fontFamily: 'var(--font-caption)', color: 'var(--color-text-secondary)' }}>
            Seen more than once
          </p>
          <div className="flex flex-wrap gap-2">
            {data?.rewatched?.slice(0, 14)?.map((t) => (
              <span
                key={t?.name}
                className="text-xs px-2 py-1 rounded"
                style={{
                  background: 'var(--color-surface-2)',
                  border: '1px solid var(--color-border)',
                  color: 'var(--color-text-primary)',
                  fontFamily: 'var(--font-caption)',
                }}
                title={t?.dates?.map(fmtDate)?.join(' · ')}
              >
                {t?.name}
                <span style={{ color: 'var(--color-primary)', marginLeft: 6, fontFamily: 'var(--font-data)' }}>
                  ×{t?.count}
                </span>
              </span>
            ))}
            {data?.rewatched?.length > 14 && (
              <span className="text-xs px-2 py-1" style={{ color: 'var(--color-text-secondary)', fontFamily: 'var(--font-caption)' }}>
                +{data?.rewatched?.length - 14} more
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default HighlightsPanel;
