import React, { useMemo } from "react";
import Icon from "components/AppIcon";

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

const StreakWidget = ({ movies }) => {
  const streakData = useMemo(() => {
    if (!movies?.length) return { weekStreak: 0, monthStreak: 0, weekMovies: 0, lastWeekMovies: 0, monthMovies: 0, lastMonthMovies: 0 };

    const now = new Date();
    const currentWeekKey = getWeekKey(now?.toISOString()?.split('T')?.[0]);
    const lastWeekDate = new Date(now);
    lastWeekDate?.setDate(now?.getDate() - 7);
    const lastWeekKey = getWeekKey(lastWeekDate?.toISOString()?.split('T')?.[0]);

    const currentMonthKey = getMonthKey(now?.toISOString()?.split('T')?.[0]);
    const lastMonthDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastMonthKey = getMonthKey(lastMonthDate?.toISOString()?.split('T')?.[0]);

    // Group movies by week and month
    const weekMap = {};
    const monthMap = {};
    movies?.forEach((m) => {
      if (!m?.date) return;
      const wk = getWeekKey(m?.date);
      const mo = getMonthKey(m?.date);
      weekMap[wk] = (weekMap?.[wk] || 0) + 1;
      monthMap[mo] = (monthMap?.[mo] || 0) + 1;
    });

    const weekMovies = weekMap?.[currentWeekKey] || 0;
    const lastWeekMovies = weekMap?.[lastWeekKey] || 0;
    const monthMovies = monthMap?.[currentMonthKey] || 0;
    const lastMonthMovies = monthMap?.[lastMonthKey] || 0;

    // Calculate weekly streak (consecutive weeks with at least 1 movie)
    const allWeekKeys = Object.keys(weekMap)?.sort()?.reverse();
    let weekStreak = 0;
    if (weekMovies > 0) {
      weekStreak = 1;
      let checkDate = new Date(now);
      checkDate?.setDate(checkDate?.getDate() - 7);
      for (let i = 0; i < 1000; i++) {
        const key = getWeekKey(checkDate?.toISOString()?.split('T')?.[0]);
        if (weekMap?.[key] > 0) {
          weekStreak++;
          checkDate?.setDate(checkDate?.getDate() - 7);
        } else break;
      }
    }

    // Calculate monthly streak (consecutive months with at least 1 movie)
    let monthStreak = 0;
    if (monthMovies > 0) {
      monthStreak = 1;
      let checkYear = now?.getFullYear();
      let checkMonth = now?.getMonth() - 1;
      for (let i = 0; i < 600; i++) {
        if (checkMonth < 0) { checkMonth = 11; checkYear--; }
        const key = `${checkYear}-${String(checkMonth + 1)?.padStart(2, '0')}`;
        if (monthMap?.[key] > 0) {
          monthStreak++;
          checkMonth--;
        } else break;
      }
    }

    return { weekStreak, monthStreak, weekMovies, lastWeekMovies, monthMovies, lastMonthMovies };
  }, [movies]);

  const weekDiff = streakData?.weekMovies - streakData?.lastWeekMovies;
  const monthDiff = streakData?.monthMovies - streakData?.lastMonthMovies;

  return (
    <div
      className="rounded-xl p-4 md:p-5"
      style={{
        background: "var(--color-card)",
        border: "1px solid var(--color-border)",
        boxShadow: "var(--shadow-md)",
      }}
    >
      <div className="flex items-center gap-2 mb-4">
        <Icon name="Flame" size={18} color="var(--color-primary)" strokeWidth={1.8} />
        <h3
          className="text-base font-semibold"
          style={{ fontFamily: "var(--font-heading)", color: "var(--color-text-primary)" }}
        >
          Streaks
        </h3>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {/* Weekly Streak */}
        <div
          className="rounded-lg p-3 flex flex-col gap-1.5"
          style={{ background: "rgba(212,175,55,0.07)", border: "1px solid rgba(212,175,55,0.18)" }}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium" style={{ fontFamily: "var(--font-caption)", color: "var(--color-text-secondary)" }}>
              Weekly
            </span>
            <Icon name="CalendarDays" size={13} color="var(--color-primary)" />
          </div>
          <div className="flex items-end gap-1.5">
            <span
              className="text-2xl font-bold leading-none"
              style={{ fontFamily: "var(--font-data)", color: "var(--color-primary)" }}
            >
              {streakData?.weekStreak}
            </span>
            <span className="text-xs mb-0.5" style={{ fontFamily: "var(--font-caption)", color: "var(--color-text-secondary)" }}>
              {streakData?.weekStreak === 1 ? "week" : "weeks"}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-xs" style={{ fontFamily: "var(--font-caption)", color: "var(--color-text-secondary)" }}>
              This week:
            </span>
            <span className="text-xs font-semibold" style={{ fontFamily: "var(--font-data)", color: "var(--color-text-primary)" }}>
              {streakData?.weekMovies} movie{streakData?.weekMovies !== 1 ? "s" : ""}
            </span>
          </div>
          {streakData?.lastWeekMovies > 0 || streakData?.weekMovies > 0 ? (
            <div className="flex items-center gap-1">
              <Icon
                name={weekDiff >= 0 ? "TrendingUp" : "TrendingDown"}
                size={11}
                color={weekDiff >= 0 ? "var(--color-success)" : "var(--color-error, #ef4444)"}
              />
              <span
                className="text-xs"
                style={{
                  fontFamily: "var(--font-caption)",
                  color: weekDiff >= 0 ? "var(--color-success)" : "var(--color-error, #ef4444)"
                }}
              >
                {weekDiff >= 0 ? "+" : ""}{weekDiff} vs last week
              </span>
            </div>
          ) : null}
        </div>

        {/* Monthly Streak */}
        <div
          className="rounded-lg p-3 flex flex-col gap-1.5"
          style={{ background: "rgba(78,205,196,0.07)", border: "1px solid rgba(78,205,196,0.18)" }}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium" style={{ fontFamily: "var(--font-caption)", color: "var(--color-text-secondary)" }}>
              Monthly
            </span>
            <Icon name="Calendar" size={13} color="var(--color-success)" />
          </div>
          <div className="flex items-end gap-1.5">
            <span
              className="text-2xl font-bold leading-none"
              style={{ fontFamily: "var(--font-data)", color: "var(--color-success)" }}
            >
              {streakData?.monthStreak}
            </span>
            <span className="text-xs mb-0.5" style={{ fontFamily: "var(--font-caption)", color: "var(--color-text-secondary)" }}>
              {streakData?.monthStreak === 1 ? "month" : "months"}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-xs" style={{ fontFamily: "var(--font-caption)", color: "var(--color-text-secondary)" }}>
              This month:
            </span>
            <span className="text-xs font-semibold" style={{ fontFamily: "var(--font-data)", color: "var(--color-text-primary)" }}>
              {streakData?.monthMovies} movie{streakData?.monthMovies !== 1 ? "s" : ""}
            </span>
          </div>
          {streakData?.lastMonthMovies > 0 || streakData?.monthMovies > 0 ? (
            <div className="flex items-center gap-1">
              <Icon
                name={monthDiff >= 0 ? "TrendingUp" : "TrendingDown"}
                size={11}
                color={monthDiff >= 0 ? "var(--color-success)" : "var(--color-error, #ef4444)"}
              />
              <span
                className="text-xs"
                style={{
                  fontFamily: "var(--font-caption)",
                  color: monthDiff >= 0 ? "var(--color-success)" : "var(--color-error, #ef4444)"
                }}
              >
                {monthDiff >= 0 ? "+" : ""}{monthDiff} vs last month
              </span>
            </div>
          ) : null}
        </div>
      </div>
      {/* Streak status message */}
      <div className="mt-3 pt-3" style={{ borderTop: "1px solid var(--color-border)" }}>
        <p className="text-xs text-center" style={{ fontFamily: "var(--font-caption)", color: "var(--color-text-secondary)" }}>
          {streakData?.weekStreak >= 4
            ? "🔥 You're on fire! 4+ week streak!"
            : streakData?.weekStreak >= 2
            ? "⚡ Keep it up! Watch a movie this week to extend your streak"
            : streakData?.weekMovies > 0
            ? "🎬 Great start! Watch next week to build your streak" :"🎯 Watch a movie this week to start your streak!"}
        </p>
      </div>
    </div>
  );
};

export default StreakWidget;
