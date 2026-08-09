import React, { useMemo } from "react";
import Icon from "components/AppIcon";

const MONTH_NAMES = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const DAY_MS = 86400000;

// ── date helpers (all UTC so no timezone drift) ─────────────────────────────
const parseUTC = (s) => new Date(`${s}T00:00:00Z`);

// Monday-start week beginning, as UTC ms
const weekStartMs = (s) => {
  const d = parseUTC(s);
  const dow = (d?.getUTCDay() + 6) % 7; // Mon = 0
  return d?.getTime() - dow * DAY_MS;
};

// months since year 0, so consecutive months differ by 1
const monthIndex = (s) => {
  const [y, m] = String(s)?.split('-')?.map(Number);
  return y * 12 + (m - 1);
};

const fmtDay = (ms) => {
  const d = new Date(ms);
  return `${d?.getUTCDate()} ${MONTH_NAMES?.[d?.getUTCMonth()]} ${d?.getUTCFullYear()}`;
};
const fmtDayShort = (ms) => {
  const d = new Date(ms);
  return `${d?.getUTCDate()} ${MONTH_NAMES?.[d?.getUTCMonth()]}`;
};
const fmtMonth = (idx) => `${MONTH_NAMES?.[idx % 12]} ${Math.floor(idx / 12)}`;

const computeStreaks = (entries) => {
  const dates = (entries || [])
    ?.map((e) => e?.watch_date)
    ?.filter(Boolean)
    ?.sort();
  if (dates?.length === 0) return null;

  const now = new Date();
  const todayISO = now?.toISOString()?.split('T')?.[0];

  // ── weeks ────────────────────────────────────────────────────────────────
  const weekCount = {};
  dates?.forEach((d) => {
    const w = weekStartMs(d);
    weekCount[w] = (weekCount?.[w] || 0) + 1;
  });
  const weeks = Object.keys(weekCount)?.map(Number)?.sort((a, b) => a - b);

  // ── months ───────────────────────────────────────────────────────────────
  const monthCount = {};
  dates?.forEach((d) => {
    const m = monthIndex(d);
    monthCount[m] = (monthCount?.[m] || 0) + 1;
  });
  const months = Object.keys(monthCount)?.map(Number)?.sort((a, b) => a - b);

  // ── longest weekly run ───────────────────────────────────────────────────
  let bestW = { len: 0, from: null, to: null };
  let runStart = weeks?.[0];
  let runLen = 1;
  for (let i = 1; i <= weeks?.length; i++) {
    const consecutive = i < weeks?.length && weeks?.[i] - weeks?.[i - 1] === 7 * DAY_MS;
    if (consecutive) {
      runLen += 1;
    } else {
      if (runLen > bestW?.len) {
        bestW = { len: runLen, from: runStart, to: weeks?.[i - 1] + 6 * DAY_MS };
      }
      runStart = weeks?.[i];
      runLen = 1;
    }
  }

  // ── longest monthly run ──────────────────────────────────────────────────
  let bestM = { len: 0, from: null, to: null };
  let mStart = months?.[0];
  let mLen = 1;
  for (let i = 1; i <= months?.length; i++) {
    const consecutive = i < months?.length && months?.[i] - months?.[i - 1] === 1;
    if (consecutive) {
      mLen += 1;
    } else {
      if (mLen > bestM?.len) {
        bestM = { len: mLen, from: mStart, to: months?.[i - 1] };
      }
      mStart = months?.[i];
      mLen = 1;
    }
  }

  // ── current runs (walk back from today) ──────────────────────────────────
  const thisWeek = weekStartMs(todayISO);
  let curW = 0;
  let curWFrom = null;
  if (weekCount?.[thisWeek]) {
    let cursor = thisWeek;
    while (weekCount?.[cursor]) { curW += 1; curWFrom = cursor; cursor -= 7 * DAY_MS; }
  }

  const thisMonth = monthIndex(todayISO);
  let curM = 0;
  let curMFrom = null;
  if (monthCount?.[thisMonth]) {
    let cursor = thisMonth;
    while (monthCount?.[cursor]) { curM += 1; curMFrom = cursor; cursor -= 1; }
  }

  // ── busiest week / month ─────────────────────────────────────────────────
  let topW = { count: 0, start: null };
  weeks?.forEach((w) => { if (weekCount?.[w] > topW?.count) topW = { count: weekCount?.[w], start: w }; });
  let topM = { count: 0, idx: null };
  months?.forEach((m) => { if (monthCount?.[m] > topM?.count) topM = { count: monthCount?.[m], idx: m }; });

  // ── longest gap between two films ────────────────────────────────────────
  let gap = { days: 0, from: null, to: null };
  for (let i = 1; i < dates?.length; i++) {
    const a = parseUTC(dates?.[i - 1])?.getTime();
    const b = parseUTC(dates?.[i])?.getTime();
    const days = Math.round((b - a) / DAY_MS);
    if (days > gap?.days) gap = { days, from: a, to: b };
  }

  const total = dates?.length;

  return {
    total,
    firstDate: parseUTC(dates?.[0])?.getTime(),
    lastDate: parseUTC(dates?.[dates?.length - 1])?.getTime(),
    currentWeek: curW,
    currentWeekFrom: curWFrom,
    currentMonth: curM,
    currentMonthFrom: curMFrom,
    thisWeekCount: weekCount?.[thisWeek] || 0,
    thisMonthCount: monthCount?.[thisMonth] || 0,
    longestWeek: bestW,
    longestMonth: bestM,
    topWeek: topW,
    topMonth: topM,
    activeWeeks: weeks?.length,
    activeMonths: months?.length,
    avgPerWeek: weeks?.length ? total / weeks?.length : 0,
    avgPerMonth: months?.length ? total / months?.length : 0,
    gap,
    weekCount,
    monthCount,
    thisWeekStart: thisWeek,
    thisMonthIdx: thisMonth,
  };
};

const MiniBars = ({ data, color }) => {
  const max = Math.max(...data?.map((d) => d?.count), 1);
  return (
    <div className="flex items-end gap-1.5 h-12">
      {data?.map((d, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-1">
          <div
            className="w-full rounded-sm"
            style={{
              height: `${Math.max((d?.count / max) * 36, d?.count > 0 ? 4 : 2)}px`,
              background: d?.count > 0 ? color : 'var(--color-surface-3)',
              opacity: d?.count > 0 ? 1 : 0.4,
            }}
            title={`${d?.label}: ${d?.count}`}
          />
          <span className="text-[9px]" style={{ fontFamily: 'var(--font-caption)', color: 'var(--color-text-secondary)' }}>
            {d?.label}
          </span>
        </div>
      ))}
    </div>
  );
};

const Stat = ({ icon, iconColor, label, value, unit, sub, valueColor }) => (
  <div
    className="rounded-lg p-3.5"
    style={{ background: 'var(--color-surface-2)', border: '1px solid var(--color-border)' }}
  >
    <div className="flex items-center justify-between mb-1.5">
      <span className="text-xs" style={{ fontFamily: 'var(--font-caption)', color: 'var(--color-text-secondary)' }}>
        {label}
      </span>
      <Icon name={icon} size={14} color={iconColor} strokeWidth={1.8} />
    </div>
    <p className="text-xl font-bold leading-tight" style={{ fontFamily: 'var(--font-data)', color: valueColor }}>
      {value}
      {unit && <span className="text-xs ml-1" style={{ color: 'var(--color-text-secondary)' }}>{unit}</span>}
    </p>
    {sub && (
      <p className="text-xs mt-1" style={{ fontFamily: 'var(--font-caption)', color: 'var(--color-text-secondary)' }}>
        {sub}
      </p>
    )}
  </div>
);

const StreaksPanel = ({ entries = [] }) => {
  const s = useMemo(() => computeStreaks(entries), [entries]);

  if (!s) {
    return (
      <div className="rounded-xl p-4 md:p-5" style={{ background: 'var(--color-card)', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-md)' }}>
        <div className="flex items-center gap-2 mb-3">
          <Icon name="Flame" size={18} color="var(--color-primary)" strokeWidth={1.8} />
          <h3 className="text-base font-semibold" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text-primary)' }}>
            Streak Tracker
          </h3>
        </div>
        <p className="text-sm py-6 text-center" style={{ fontFamily: 'var(--font-caption)', color: 'var(--color-text-secondary)' }}>
          No entries yet.
        </p>
      </div>
    );
  }

  // last 8 weeks / last 6 months for the mini charts
  const lastWeeks = Array.from({ length: 8 }, (_, i) => {
    const start = s?.thisWeekStart - (7 - i) * 7 * DAY_MS;
    return { label: fmtDayShort(start), count: s?.weekCount?.[start] || 0 };
  });
  const lastMonths = Array.from({ length: 6 }, (_, i) => {
    const idx = s?.thisMonthIdx - (5 - i);
    return { label: MONTH_NAMES?.[idx % 12], count: s?.monthCount?.[idx] || 0 };
  });

  const gapMonths = Math.round((s?.gap?.days / 30.44) * 10) / 10;

  return (
    <div className="rounded-xl p-4 md:p-5" style={{ background: 'var(--color-card)', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-md)' }}>
      <div className="flex items-center gap-2 mb-4">
        <Icon name="Flame" size={18} color="var(--color-primary)" strokeWidth={1.8} />
        <h3 className="text-base font-semibold" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text-primary)' }}>
          Streak Tracker
        </h3>
        <span className="ml-auto text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(212,175,55,0.12)', color: 'var(--color-primary)', fontFamily: 'var(--font-caption)' }}>
          {s?.total} total movies
        </span>
      </div>

      {/* current streaks */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
        <div className="rounded-lg p-4" style={{ background: 'linear-gradient(135deg, rgba(212,175,55,0.10), rgba(212,175,55,0.02))', border: '1px solid rgba(212,175,55,0.25)' }}>
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-semibold tracking-wide" style={{ fontFamily: 'var(--font-caption)', color: 'var(--color-primary)' }}>CURRENT WEEKLY</span>
            <Icon name="CalendarCheck" size={15} color="var(--color-primary)" strokeWidth={1.8} />
          </div>
          <p className="text-2xl font-bold" style={{ fontFamily: 'var(--font-data)', color: 'var(--color-primary)' }}>
            {s?.currentWeek}<span className="text-sm ml-1.5" style={{ color: 'var(--color-text-secondary)' }}>weeks</span>
          </p>
          <p className="text-xs mt-1" style={{ fontFamily: 'var(--font-caption)', color: 'var(--color-text-secondary)' }}>
            {s?.currentWeek > 0
              ? `Since ${fmtDay(s?.currentWeekFrom)} · ${s?.thisWeekCount} this week`
              : 'Nothing watched this week'}
          </p>
        </div>

        <div className="rounded-lg p-4" style={{ background: 'linear-gradient(135deg, rgba(78,205,196,0.10), rgba(78,205,196,0.02))', border: '1px solid rgba(78,205,196,0.25)' }}>
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-semibold tracking-wide" style={{ fontFamily: 'var(--font-caption)', color: 'var(--color-success)' }}>CURRENT MONTHLY</span>
            <Icon name="CalendarRange" size={15} color="var(--color-success)" strokeWidth={1.8} />
          </div>
          <p className="text-2xl font-bold" style={{ fontFamily: 'var(--font-data)', color: 'var(--color-success)' }}>
            {s?.currentMonth}<span className="text-sm ml-1.5" style={{ color: 'var(--color-text-secondary)' }}>months</span>
          </p>
          <p className="text-xs mt-1" style={{ fontFamily: 'var(--font-caption)', color: 'var(--color-text-secondary)' }}>
            {s?.currentMonth > 0
              ? `Since ${fmtMonth(s?.currentMonthFrom)} · ${s?.thisMonthCount} this month`
              : 'Nothing watched this month'}
          </p>
        </div>
      </div>

      {/* records */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-3">
        <Stat
          icon="Trophy" iconColor="var(--color-primary)"
          label="Longest Weekly" value={s?.longestWeek?.len} unit="w"
          valueColor="var(--color-primary)"
          sub={s?.longestWeek?.from ? `${fmtDay(s?.longestWeek?.from)} – ${fmtDay(s?.longestWeek?.to)}` : ''}
        />
        <Stat
          icon="Award" iconColor="var(--color-success)"
          label="Longest Monthly" value={s?.longestMonth?.len} unit="m"
          valueColor="var(--color-success)"
          sub={s?.longestMonth?.from !== null ? `${fmtMonth(s?.longestMonth?.from)} – ${fmtMonth(s?.longestMonth?.to)}` : ''}
        />
        <Stat
          icon="Zap" iconColor="var(--color-accent)"
          label="Most Active Week" value={s?.topWeek?.count}
          valueColor="var(--color-accent)"
          sub={s?.topWeek?.start ? `${fmtDay(s?.topWeek?.start)} – ${fmtDay(s?.topWeek?.start + 6 * DAY_MS)}` : ''}
        />
        <Stat
          icon="Star" iconColor="var(--color-warning)"
          label="Most Active Month" value={s?.topMonth?.count}
          valueColor="var(--color-warning)"
          sub={s?.topMonth?.idx !== null ? fmtMonth(s?.topMonth?.idx) : ''}
        />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-3">
        <Stat
          icon="BarChart3" iconColor="var(--color-primary)"
          label="Avg / Active Week" value={s?.avgPerWeek?.toFixed(1)}
          valueColor="var(--color-text-primary)" sub="movies per week"
        />
        <Stat
          icon="TrendingUp" iconColor="var(--color-success)"
          label="Avg / Active Month" value={s?.avgPerMonth?.toFixed(1)}
          valueColor="var(--color-text-primary)" sub="movies per month"
        />
        <Stat
          icon="CalendarDays" iconColor="var(--color-secondary)"
          label="Active Weeks" value={s?.activeWeeks}
          valueColor="var(--color-secondary)"
          sub={`since ${fmtDay(s?.firstDate)}`}
        />
        <Stat
          icon="CalendarClock" iconColor="var(--color-success)"
          label="Active Months" value={s?.activeMonths}
          valueColor="var(--color-success)"
          sub={`since ${fmtDay(s?.firstDate)}`}
        />
      </div>

      {/* the gap */}
      {s?.gap?.days > 0 && (
        <div
          className="rounded-lg p-3.5 mb-3"
          style={{ background: 'var(--color-surface-2)', border: '1px solid var(--color-border)' }}
        >
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs" style={{ fontFamily: 'var(--font-caption)', color: 'var(--color-text-secondary)' }}>
              Longest gap between films
            </span>
            <Icon name="CalendarX" size={14} color="var(--color-text-secondary)" strokeWidth={1.8} />
          </div>
          <p className="text-xl font-bold leading-tight" style={{ fontFamily: 'var(--font-data)', color: 'var(--color-text-primary)' }}>
            {s?.gap?.days}<span className="text-xs ml-1" style={{ color: 'var(--color-text-secondary)' }}>days</span>
            {gapMonths >= 2 && (
              <span className="text-xs ml-2" style={{ color: 'var(--color-text-secondary)', fontFamily: 'var(--font-caption)' }}>
                (~{gapMonths} months)
              </span>
            )}
          </p>
          <p className="text-xs mt-1" style={{ fontFamily: 'var(--font-caption)', color: 'var(--color-text-secondary)' }}>
            {fmtDay(s?.gap?.from)} → {fmtDay(s?.gap?.to)}
          </p>
        </div>
      )}

      {/* recent activity */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="rounded-lg p-3.5" style={{ background: 'var(--color-surface-2)', border: '1px solid var(--color-border)' }}>
          <div className="flex items-center gap-1.5 mb-2.5">
            <Icon name="Calendar" size={13} color="var(--color-primary)" strokeWidth={1.8} />
            <span className="text-xs" style={{ fontFamily: 'var(--font-caption)', color: 'var(--color-text-secondary)' }}>Last 8 weeks</span>
          </div>
          <MiniBars data={lastWeeks} color="var(--color-primary)" />
        </div>
        <div className="rounded-lg p-3.5" style={{ background: 'var(--color-surface-2)', border: '1px solid var(--color-border)' }}>
          <div className="flex items-center gap-1.5 mb-2.5">
            <Icon name="Calendar" size={13} color="var(--color-success)" strokeWidth={1.8} />
            <span className="text-xs" style={{ fontFamily: 'var(--font-caption)', color: 'var(--color-text-secondary)' }}>Last 6 months</span>
          </div>
          <MiniBars data={lastMonths} color="var(--color-success)" />
        </div>
      </div>
    </div>
  );
};

export default StreaksPanel;
