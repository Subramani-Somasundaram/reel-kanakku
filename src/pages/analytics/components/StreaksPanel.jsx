import React, { useMemo } from "react";
import Icon from "components/AppIcon";

const MONTH_NAMES = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

const getWeekNumber = (date) => {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d?.getUTCDay() || 7;
  d?.setUTCDate(d?.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
};

const getWeekKey = (dateStr) => {
  const d = new Date(dateStr);
  return `${d?.getFullYear()}-W${String(getWeekNumber(d))?.padStart(2, '0')}`;
};

const getMonthKey = (dateStr) => {
  const d = new Date(dateStr);
  return `${d?.getFullYear()}-${String(d?.getMonth() + 1)?.padStart(2, '0')}`;
};

const computeStreaks = (entries) => {
  if (!entries?.length) return null;

  const now = new Date();

  // Build week and month maps
  const weekMap = {};
  const monthMap = {};

  entries?.forEach((e) => {
    if (!e?.watch_date) return;
    const wk = getWeekKey(e?.watch_date);
    const mo = getMonthKey(e?.watch_date);
    weekMap[wk] = (weekMap?.[wk] || 0) + 1;
    monthMap[mo] = (monthMap?.[mo] || 0) + 1;
  });

  const currentWeekKey = getWeekKey(now?.toISOString()?.split('T')?.[0]);
  const currentMonthKey = getMonthKey(now?.toISOString()?.split('T')?.[0]);

  // ── Current weekly streak ──────────────────────────────────────────────────
  let currentWeekStreak = 0;
  if (weekMap?.[currentWeekKey] > 0) {
    currentWeekStreak = 1;
    let checkDate = new Date(now);
    checkDate?.setDate(checkDate?.getDate() - 7);
    for (let i = 0; i < 52; i++) {
      const key = getWeekKey(checkDate?.toISOString()?.split('T')?.[0]);
      if (weekMap?.[key] > 0) { currentWeekStreak++; checkDate?.setDate(checkDate?.getDate() - 7); }
      else break;
    }
  }

  // ── Longest weekly streak ──────────────────────────────────────────────────
  const sortedWeeks = Object.keys(weekMap)?.sort();
  let longestWeekStreak = 0;
  let tempWeekStreak = 0;
  let prevWeekDate = null;
  sortedWeeks?.forEach((wk) => {
    const [yr, wNum] = wk?.split('-W')?.map(Number);
    if (prevWeekDate) {
      const prevWk = getWeekKey(prevWeekDate?.toISOString()?.split('T')?.[0]);
      const [pyr, pwNum] = prevWk?.split('-W')?.map(Number);
      const isConsecutive = (yr === pyr && wNum === pwNum + 1) || (yr === pyr + 1 && pwNum >= 52 && wNum === 1);
      if (isConsecutive) tempWeekStreak++;
      else tempWeekStreak = 1;
    } else {
      tempWeekStreak = 1;
    }
    longestWeekStreak = Math.max(longestWeekStreak, tempWeekStreak);
    // Advance prevWeekDate by 7 days from a date in that week
    const jan4 = new Date(Date.UTC(yr, 0, 4));
    const weekStart = new Date(jan4.getTime() + (wNum - 1) * 7 * 86400000);
    prevWeekDate = weekStart;
  });

  // ── Current monthly streak ─────────────────────────────────────────────────
  let currentMonthStreak = 0;
  if (monthMap?.[currentMonthKey] > 0) {
    currentMonthStreak = 1;
    let checkYear = now?.getFullYear();
    let checkMonth = now?.getMonth() - 1;
    for (let i = 0; i < 24; i++) {
      if (checkMonth < 0) { checkMonth = 11; checkYear--; }
      const key = `${checkYear}-${String(checkMonth + 1)?.padStart(2, '0')}`;
      if (monthMap?.[key] > 0) { currentMonthStreak++; checkMonth--; }
      else break;
    }
  }

  // ── Longest monthly streak ─────────────────────────────────────────────────
  const sortedMonths = Object.keys(monthMap)?.sort();
  let longestMonthStreak = 0;
  let tempMonthStreak = 0;
  let prevMonthKey = null;
  sortedMonths?.forEach((mo) => {
    const [yr, mn] = mo?.split('-')?.map(Number);
    if (prevMonthKey) {
      const [pyr, pmn] = prevMonthKey?.split('-')?.map(Number);
      const isConsecutive = (yr === pyr && mn === pmn + 1) || (yr === pyr + 1 && pmn === 12 && mn === 1);
      if (isConsecutive) tempMonthStreak++;
      else tempMonthStreak = 1;
    } else {
      tempMonthStreak = 1;
    }
    longestMonthStreak = Math.max(longestMonthStreak, tempMonthStreak);
    prevMonthKey = mo;
  });

  // ── Most active week ───────────────────────────────────────────────────────
  let mostActiveWeekKey = null;
  let mostActiveWeekCount = 0;
  Object.entries(weekMap)?.forEach(([k, v]) => {
    if (v > mostActiveWeekCount) { mostActiveWeekCount = v; mostActiveWeekKey = k; }
  });
  let mostActiveWeekLabel = '—';
  if (mostActiveWeekKey) {
    const [yr, wNum] = mostActiveWeekKey?.split('-W')?.map(Number);
    mostActiveWeekLabel = `Week ${wNum}, ${yr}`;
  }

  // ── Most active month ──────────────────────────────────────────────────────
  let mostActiveMonthKey = null;
  let mostActiveMonthCount = 0;
  Object.entries(monthMap)?.forEach(([k, v]) => {
    if (v > mostActiveMonthCount) { mostActiveMonthCount = v; mostActiveMonthKey = k; }
  });
  let mostActiveMonthLabel = '—';
  if (mostActiveMonthKey) {
    const [yr, mn] = mostActiveMonthKey?.split('-')?.map(Number);
    mostActiveMonthLabel = `${MONTH_NAMES?.[mn - 1]} ${yr}`;
  }

  // ── Average movies per week (active weeks only) ────────────────────────────
  const totalWeeks = Object.keys(weekMap)?.length;
  const avgPerWeek = totalWeeks > 0 ? (entries?.length / totalWeeks)?.toFixed(1) : '0';

  // ── Average movies per month (active months only) ─────────────────────────
  const totalMonths = Object.keys(monthMap)?.length;
  const avgPerMonth = totalMonths > 0 ? (entries?.length / totalMonths)?.toFixed(1) : '0';

  // ── Total active weeks / months ────────────────────────────────────────────
  const activeWeeks = totalWeeks;
  const activeMonths = totalMonths;

  // ── Current week / month movies ────────────────────────────────────────────
  const thisWeekMovies = weekMap?.[currentWeekKey] || 0;
  const thisMonthMovies = monthMap?.[currentMonthKey] || 0;

  // ── Best streak ever (week or month) ──────────────────────────────────────
  const overallBest = Math.max(longestWeekStreak, longestMonthStreak);

  // ── Last 8 weeks for mini bar chart ───────────────────────────────────────
  const last8Weeks = [];
  for (let i = 7; i >= 0; i--) {
    const d = new Date(now);
    d?.setDate(d?.getDate() - i * 7);
    const key = getWeekKey(d?.toISOString()?.split('T')?.[0]);
    const [, wNum] = key?.split('-W')?.map(Number);
    last8Weeks?.push({ label: `W${wNum}`, count: weekMap?.[key] || 0, key });
  }

  // ── Last 6 months for mini bar chart ──────────────────────────────────────
  const last6Months = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = getMonthKey(d?.toISOString()?.split('T')?.[0]);
    last6Months?.push({ label: MONTH_NAMES?.[d?.getMonth()], count: monthMap?.[key] || 0, key });
  }

  return {
    currentWeekStreak,
    longestWeekStreak,
    currentMonthStreak,
    longestMonthStreak,
    mostActiveWeekLabel,
    mostActiveWeekCount,
    mostActiveMonthLabel,
    mostActiveMonthCount,
    avgPerWeek,
    avgPerMonth,
    activeWeeks,
    activeMonths,
    thisWeekMovies,
    thisMonthMovies,
    last8Weeks,
    last6Months,
    overallBest,
    totalMovies: entries?.length,
  };
};

const StatCard = ({ icon, iconColor, label, value, sub, bg, border }) => (
  <div
    className="rounded-lg p-3 flex flex-col gap-1"
    style={{ background: bg || "var(--color-surface-2)", border: `1px solid ${border || "var(--color-border)"}` }}
  >
    <div className="flex items-center justify-between">
      <span className="text-xs" style={{ fontFamily: "var(--font-caption)", color: "var(--color-text-secondary)" }}>{label}</span>
      <Icon name={icon} size={13} color={iconColor || "var(--color-primary)"} />
    </div>
    <span className="text-xl font-bold leading-tight" style={{ fontFamily: "var(--font-data)", color: iconColor || "var(--color-primary)" }}>
      {value}
    </span>
    {sub && <span className="text-xs" style={{ fontFamily: "var(--font-caption)", color: "var(--color-text-secondary)" }}>{sub}</span>}
  </div>
);

const MiniBarChart = ({ data, maxVal, color }) => {
  const max = maxVal || Math.max(...data?.map((d) => d?.count), 1);
  return (
    <div className="flex items-end gap-1 h-12">
      {data?.map((d, i) => (
        <div key={i} className="flex flex-col items-center gap-0.5 flex-1">
          <div className="w-full rounded-sm" style={{ height: `${Math.max((d?.count / max) * 40, d?.count > 0 ? 4 : 2)}px`, background: d?.count > 0 ? color : "var(--color-surface-2)", transition: "height 0.3s ease" }} />
          <span className="text-xs" style={{ fontFamily: "var(--font-caption)", color: "var(--color-text-secondary)", fontSize: "9px" }}>{d?.label}</span>
        </div>
      ))}
    </div>
  );
};

const StreaksPanel = ({ entries }) => {
  const data = useMemo(() => computeStreaks(entries), [entries]);

  if (!data) {
    return (
      <div
        className="rounded-xl p-6 flex flex-col items-center justify-center gap-3"
        style={{ background: "var(--color-card)", border: "1px solid var(--color-border)", boxShadow: "var(--shadow-md)", minHeight: "200px" }}
      >
        <Icon name="Flame" size={32} color="var(--color-text-secondary)" strokeWidth={1.5} />
        <p className="text-sm text-center" style={{ fontFamily: "var(--font-caption)", color: "var(--color-text-secondary)" }}>
          No streak data yet. Start watching movies to build your streaks!
        </p>
      </div>
    );
  }

  return (
    <div
      className="rounded-xl p-4 md:p-5"
      style={{ background: "var(--color-card)", border: "1px solid var(--color-border)", boxShadow: "var(--shadow-md)" }}
    >
      {/* Header */}
      <div className="flex items-center gap-2 mb-5">
        <Icon name="Flame" size={18} color="var(--color-primary)" strokeWidth={1.8} />
        <h3 className="text-base font-semibold" style={{ fontFamily: "var(--font-heading)", color: "var(--color-text-primary)" }}>
          Streak Tracker
        </h3>
        <span className="ml-auto text-xs px-2 py-0.5 rounded-full" style={{ background: "rgba(212,175,55,0.12)", color: "var(--color-primary)", fontFamily: "var(--font-caption)", border: "1px solid rgba(212,175,55,0.25)" }}>
          {data?.totalMovies} total movies
        </span>
      </div>
      {/* Current Streaks — hero row */}
      <div className="grid grid-cols-2 gap-3 mb-5">
        <div
          className="rounded-xl p-4 flex flex-col gap-2"
          style={{ background: "linear-gradient(135deg, rgba(212,175,55,0.12), rgba(212,175,55,0.04))", border: "1px solid rgba(212,175,55,0.3)" }}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wide" style={{ fontFamily: "var(--font-caption)", color: "var(--color-primary)" }}>Current Weekly</span>
            <Icon name="CalendarDays" size={14} color="var(--color-primary)" />
          </div>
          <div className="flex items-end gap-1.5">
            <span className="text-4xl font-bold leading-none" style={{ fontFamily: "var(--font-data)", color: "var(--color-primary)" }}>{data?.currentWeekStreak}</span>
            <span className="text-sm mb-1" style={{ fontFamily: "var(--font-caption)", color: "var(--color-text-secondary)" }}>weeks</span>
          </div>
          <span className="text-xs" style={{ fontFamily: "var(--font-caption)", color: "var(--color-text-secondary)" }}>
            {data?.thisWeekMovies} movie{data?.thisWeekMovies !== 1 ? "s" : ""} this week
          </span>
        </div>

        <div
          className="rounded-xl p-4 flex flex-col gap-2"
          style={{ background: "linear-gradient(135deg, rgba(78,205,196,0.12), rgba(78,205,196,0.04))", border: "1px solid rgba(78,205,196,0.3)" }}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wide" style={{ fontFamily: "var(--font-caption)", color: "var(--color-success)" }}>Current Monthly</span>
            <Icon name="Calendar" size={14} color="var(--color-success)" />
          </div>
          <div className="flex items-end gap-1.5">
            <span className="text-4xl font-bold leading-none" style={{ fontFamily: "var(--font-data)", color: "var(--color-success)" }}>{data?.currentMonthStreak}</span>
            <span className="text-sm mb-1" style={{ fontFamily: "var(--font-caption)", color: "var(--color-text-secondary)" }}>months</span>
          </div>
          <span className="text-xs" style={{ fontFamily: "var(--font-caption)", color: "var(--color-text-secondary)" }}>
            {data?.thisMonthMovies} movie{data?.thisMonthMovies !== 1 ? "s" : ""} this month
          </span>
        </div>
      </div>
      {/* Stats grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mb-5">
        <StatCard
          icon="Trophy"
          iconColor="var(--color-primary)"
          label="Longest Weekly"
          value={`${data?.longestWeekStreak}w`}
          sub="Best week streak"
          bg="rgba(212,175,55,0.06)"
          border="rgba(212,175,55,0.2)"
        />
        <StatCard
          icon="Award"
          iconColor="var(--color-success)"
          label="Longest Monthly"
          value={`${data?.longestMonthStreak}m`}
          sub="Best month streak"
          bg="rgba(78,205,196,0.06)"
          border="rgba(78,205,196,0.2)"
        />
        <StatCard
          icon="Zap"
          iconColor="#F97316"
          label="Most Active Week"
          value={data?.mostActiveWeekCount}
          sub={data?.mostActiveWeekLabel}
          bg="rgba(249,115,22,0.06)"
          border="rgba(249,115,22,0.2)"
        />
        <StatCard
          icon="Star"
          iconColor="#FF6B6B"
          label="Most Active Month"
          value={data?.mostActiveMonthCount}
          sub={data?.mostActiveMonthLabel}
          bg="rgba(255,107,107,0.06)"
          border="rgba(255,107,107,0.2)"
        />
        <StatCard
          icon="BarChart2"
          iconColor="var(--color-primary)"
          label="Avg / Active Week"
          value={data?.avgPerWeek}
          sub="movies per week"
          bg="var(--color-surface-2)"
          border="var(--color-border)"
        />
        <StatCard
          icon="TrendingUp"
          iconColor="var(--color-success)"
          label="Avg / Active Month"
          value={data?.avgPerMonth}
          sub="movies per month"
          bg="var(--color-surface-2)"
          border="var(--color-border)"
        />
        <StatCard
          icon="CalendarCheck"
          iconColor="#9B59B6"
          label="Active Weeks"
          value={data?.activeWeeks}
          sub="weeks with movies"
          bg="rgba(155,89,182,0.06)"
          border="rgba(155,89,182,0.2)"
        />
        <StatCard
          icon="CalendarRange"
          iconColor="#3498DB"
          label="Active Months"
          value={data?.activeMonths}
          sub="months with movies"
          bg="rgba(52,152,219,0.06)"
          border="rgba(52,152,219,0.2)"
        />
      </div>
      {/* Mini charts */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Last 8 weeks */}
        <div className="rounded-lg p-3" style={{ background: "var(--color-surface-2)", border: "1px solid var(--color-border)" }}>
          <div className="flex items-center gap-1.5 mb-3">
            <Icon name="CalendarDays" size={13} color="var(--color-primary)" />
            <span className="text-xs font-medium" style={{ fontFamily: "var(--font-caption)", color: "var(--color-text-primary)" }}>Last 8 Weeks</span>
          </div>
          <MiniBarChart data={data?.last8Weeks} color="var(--color-primary)" maxVal={0} />
        </div>

        {/* Last 6 months */}
        <div className="rounded-lg p-3" style={{ background: "var(--color-surface-2)", border: "1px solid var(--color-border)" }}>
          <div className="flex items-center gap-1.5 mb-3">
            <Icon name="Calendar" size={13} color="var(--color-success)" />
            <span className="text-xs font-medium" style={{ fontFamily: "var(--font-caption)", color: "var(--color-text-primary)" }}>Last 6 Months</span>
          </div>
          <MiniBarChart data={data?.last6Months} color="var(--color-success)" maxVal={0} />
        </div>
      </div>
    </div>
  );
};

export default StreaksPanel;
