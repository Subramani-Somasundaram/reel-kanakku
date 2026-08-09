import React, { useMemo } from 'react';
import Icon from 'components/AppIcon';
import { useCurrency } from 'context/CurrencyContext';

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const periodLabel = (period, year, month) => {
  if (period === 'month') return `${MONTH_NAMES?.[month]} ${year}`;
  if (period === 'year') return String(year);
  return 'All time';
};

const fmtDate = (d) => {
  if (!d) return '';
  const [y, m, day] = String(d)?.split('-');
  return `${parseInt(day, 10)} ${MONTH_NAMES?.[parseInt(m, 10) - 1]?.slice(0, 3)} ${y}`;
};

const GeographyPanel = ({ entries = [], period = 'all', year, month }) => {
  const { formatCurrency } = useCurrency();

  const data = useMemo(() => {
    const rows = (entries || [])?.filter((e) => e?.watch_date);
    if (rows?.length === 0) return null;

    const tree = {};
    const cityStats = {};
    let untagged = 0;

    rows?.forEach((e) => {
      const country = (e?.country || '')?.trim();
      const state = (e?.state || '')?.trim();
      const city = (e?.city || '')?.trim();
      const cost = parseFloat(e?.total_cost) || 0;

      if (!country && !state && !city) { untagged += 1; return; }

      const co = country || 'Unknown';
      const st = state || 'Unknown';
      const ci = city || 'Unknown';

      if (!tree?.[co]) tree[co] = { films: 0, spend: 0, states: {} };
      tree[co].films += 1;
      tree[co].spend += cost;

      if (!tree?.[co]?.states?.[st]) tree[co].states[st] = { films: 0, spend: 0, cities: {} };
      tree[co].states[st].films += 1;
      tree[co].states[st].spend += cost;

      if (!tree?.[co]?.states?.[st]?.cities?.[ci]) tree[co].states[st].cities[ci] = { films: 0, spend: 0 };
      tree[co].states[st].cities[ci].films += 1;
      tree[co].states[st].cities[ci].spend += cost;

      const key = `${ci}|${st}|${co}`;
      if (!cityStats?.[key]) {
        cityStats[key] = { city: ci, state: st, country: co, films: 0, spend: 0, first: e?.watch_date, last: e?.watch_date, titles: [] };
      }
      const cs = cityStats?.[key];
      cs.films += 1;
      cs.spend += cost;
      if (e?.watch_date < cs?.first) cs.first = e?.watch_date;
      if (e?.watch_date > cs?.last) cs.last = e?.watch_date;
      cs?.titles?.push({ name: e?.movie_name, date: e?.watch_date });
    });

    const countries = Object.entries(tree)
      ?.map(([name, v]) => ({
        name,
        films: v?.films,
        spend: v?.spend,
        states: Object.entries(v?.states)
          ?.map(([sName, sv]) => ({
            name: sName,
            films: sv?.films,
            spend: sv?.spend,
            cities: Object.entries(sv?.cities)
              ?.map(([cName, cv]) => ({ name: cName, films: cv?.films, spend: cv?.spend }))
              ?.sort((a, b) => b?.films - a?.films),
          }))
          ?.sort((a, b) => b?.films - a?.films),
      }))
      ?.sort((a, b) => b?.films - a?.films);

    const cities = Object.values(cityStats)?.sort((a, b) => b?.films - a?.films);
    const totalFilms = rows?.length - untagged;
    const home = cities?.[0];
    const away = cities?.slice(1);
    const awayFilms = away?.reduce((s, c) => s + c?.films, 0);
    const onceOnly = cities?.filter((c) => c?.films === 1);

    const byAvg = cities
      ?.filter((c) => c?.films >= 2)
      ?.map((c) => ({ ...c, avg: c?.spend / c?.films }))
      ?.sort((a, b) => b?.avg - a?.avg);

    return {
      countries, cities, totalFilms, untagged,
      home, away, awayFilms, onceOnly, byAvg,
      countryCount: countries?.length,
      cityCount: cities?.length,
    };
  }, [entries]);

  const label = periodLabel(period, year, month);

  const shell = (children) => (
    <div
      className="rounded-xl p-4 md:p-5"
      style={{ background: 'var(--color-card)', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-md)' }}
    >
      <div className="flex items-center gap-2 mb-1">
        <Icon name="Globe2" size={18} color="var(--color-primary)" strokeWidth={1.8} />
        <h3 className="text-base font-semibold" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text-primary)' }}>
          Geography
        </h3>
        <span
          className="ml-auto text-xs px-2 py-0.5 rounded-full"
          style={{ background: 'rgba(212,175,55,0.12)', color: 'var(--color-primary)', fontFamily: 'var(--font-caption)' }}
        >
          {label}
        </span>
      </div>
      {children}
    </div>
  );

  if (!data) {
    return shell(
      <p className="text-sm py-6 text-center" style={{ fontFamily: 'var(--font-caption)', color: 'var(--color-text-secondary)' }}>
        Nothing logged for {label} yet.
      </p>
    );
  }

  // ── derived observations ─────────────────────────────────────────────────
  const facts = [];

  if (data?.away?.length > 0) {
    facts?.push(
      `${data?.awayFilms} ${data?.awayFilms === 1 ? 'film' : 'films'} outside ${data?.home?.city}, across ${data?.away?.length} ${data?.away?.length === 1 ? 'city' : 'cities'}.`
    );
  } else if (data?.home) {
    facts?.push(`Every film was in ${data?.home?.city}.`);
  }

  if (data?.countries?.length > 1) {
    const [a, b] = data?.countries;
    const avgA = a?.spend / a?.films;
    const avgB = b?.spend / b?.films;
    if (avgA > 0 && avgB > 0) {
      const hi = avgB > avgA ? b : a;
      const lo = avgB > avgA ? a : b;
      const ratio = ((hi?.spend / hi?.films) / (lo?.spend / lo?.films))?.toFixed(1);
      facts?.push(
        `A film in ${hi?.name} averaged ${formatCurrency((hi?.spend / hi?.films)?.toFixed(2))} against ${formatCurrency((lo?.spend / lo?.films)?.toFixed(2))} in ${lo?.name} — ${ratio}× the cost.`
      );
    }
  }

  if (data?.byAvg?.length > 1) {
    const top = data?.byAvg?.[0];
    facts?.push(
      `${top?.city} was the priciest place to watch a film — ${formatCurrency(top?.avg?.toFixed(2))} per visit across ${top?.films}.`
    );
  }

  if (data?.onceOnly?.length > 0) {
    const names = data?.onceOnly?.map((c) => c?.city);
    const shown = names?.slice(0, 4)?.join(', ');
    facts?.push(
      `${names?.length} ${names?.length === 1 ? 'city' : 'cities'} visited exactly once: ${shown}${names?.length > 4 ? ` and ${names?.length - 4} more` : ''}.`
    );
  }

  const earliest = data?.cities?.reduce((min, c) => (!min || c?.first < min?.first ? c : min), null);
  if (earliest && data?.cities?.length > 1) {
    facts?.push(`Your record starts in ${earliest?.city} on ${fmtDate(earliest?.first)}.`);
  }

  return shell(
    <>
      <p className="text-xs mb-4" style={{ fontFamily: 'var(--font-caption)', color: 'var(--color-text-secondary)' }}>
        {data?.totalFilms} {data?.totalFilms === 1 ? 'film' : 'films'} &middot; {data?.cityCount} {data?.cityCount === 1 ? 'city' : 'cities'} &middot; {data?.countryCount} {data?.countryCount === 1 ? 'country' : 'countries'}
        {data?.untagged > 0 && ` · ${data?.untagged} without a location`}
      </p>

      {/* nested breakdown */}
      <div className="space-y-4">
        {data?.countries?.map((co) => (
          <div key={co?.name}>
            <div
              className="flex items-baseline justify-between gap-3 pb-1.5 mb-2"
              style={{ borderBottom: '1px solid var(--color-border)' }}
            >
              <span className="text-sm font-semibold" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text-primary)' }}>
                {co?.name}
              </span>
              <span className="flex items-baseline gap-3 flex-shrink-0">
                <span className="text-sm font-bold" style={{ fontFamily: 'var(--font-data)', color: 'var(--color-primary)' }}>
                  {co?.films}
                </span>
                <span className="text-xs" style={{ fontFamily: 'var(--font-data)', color: 'var(--color-text-secondary)' }}>
                  {formatCurrency(co?.spend?.toFixed(2))}
                </span>
              </span>
            </div>

            {co?.states?.map((st) => (
              <div key={st?.name} className="mb-2 last:mb-0">
                <div className="flex items-baseline justify-between gap-3 pl-3">
                  <span className="text-xs font-medium" style={{ fontFamily: 'var(--font-caption)', color: 'var(--color-text-secondary)' }}>
                    {st?.name}
                  </span>
                  <span className="text-xs" style={{ fontFamily: 'var(--font-data)', color: 'var(--color-text-secondary)' }}>
                    {st?.films}
                  </span>
                </div>
                {st?.cities?.map((ci) => (
                  <div key={ci?.name} className="flex items-baseline justify-between gap-3 pl-7 py-0.5">
                    <span className="text-sm truncate" style={{ fontFamily: 'var(--font-body)', color: 'var(--color-text-primary)' }}>
                      {ci?.name}
                    </span>
                    <span className="flex items-baseline gap-3 flex-shrink-0">
                      <span className="text-sm" style={{ fontFamily: 'var(--font-data)', color: 'var(--color-text-primary)' }}>
                        {ci?.films}
                      </span>
                      <span
                        className="text-xs text-right"
                        style={{ fontFamily: 'var(--font-data)', color: 'var(--color-text-secondary)', minWidth: 76 }}
                      >
                        {formatCurrency(ci?.spend?.toFixed(2))}
                      </span>
                    </span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* observations */}
      {facts?.length > 0 && (
        <div className="mt-5 pt-4" style={{ borderTop: '1px solid var(--color-border)' }}>
          <p
            className="text-xs font-semibold uppercase tracking-wider mb-2.5"
            style={{ fontFamily: 'var(--font-caption)', color: 'var(--color-text-secondary)' }}
          >
            What this says
          </p>
          <ul className="space-y-1.5">
            {facts?.map((f, i) => (
              <li key={i} className="flex gap-2">
                <span style={{ color: 'var(--color-primary)' }}>&middot;</span>
                <span className="text-sm" style={{ fontFamily: 'var(--font-body)', color: 'var(--color-text-secondary)' }}>
                  {f}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
};

export default GeographyPanel;
