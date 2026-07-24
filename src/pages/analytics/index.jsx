import React, { useState, useRef, useEffect, useCallback } from 'react';
import TopNavigation from 'components/ui/TopNavigation';
import DataExportModal from 'components/ui/DataExportModal';
import QuickActionButton from 'components/ui/QuickActionButton';
import Button from 'components/ui/Button';
import Icon from 'components/AppIcon';
import SpendingBreakdownChart from './components/SpendingBreakdownChart';
import SpendingDistributionChart from './components/SpendingDistributionChart';
import YearlyStatsPanel from './components/YearlyStatsPanel';
import TheatreRankingPanel from './components/TheatreRankingPanel';
import LanguagePreferencePanel from './components/LanguagePreferencePanel';
import PeakViewingPatterns from './components/PeakViewingPatterns';
import AvgCostAnalysis from './components/AvgCostAnalysis';
import PeriodSelector from './components/PeriodSelector';
import CompanionsPanel from './components/CompanionsPanel';
import StreaksPanel from './components/StreaksPanel';
import { supabase } from 'lib/supabase';
import { useAuth } from 'contexts/AuthContext';

const CURRENT_YEAR = new Date()?.getFullYear();
const CURRENT_MONTH = new Date()?.getMonth();

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const MONTH_NAMES_SHORT = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

const YearSelector = ({ selectedYear, onChange, availableYears }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (ref?.current && !ref?.current?.contains(e?.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const years = availableYears?.length > 0 ? availableYears : [CURRENT_YEAR];

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
        style={{
          background: 'var(--color-surface-2)',
          border: '1px solid var(--color-border)',
          color: 'var(--color-text-primary)',
          fontFamily: 'var(--font-caption)',
          height: '34px'
        }}
      >
        <Icon name="Calendar" size={13} color="var(--color-primary)" />
        <span>{selectedYear}</span>
        <Icon name={open ? 'ChevronUp' : 'ChevronDown'} size={12} color="var(--color-text-secondary)" />
      </button>
      {open && (
        <div
          className="absolute right-0 mt-1 rounded-lg overflow-hidden z-50"
          style={{
            background: 'var(--color-card)',
            border: '1px solid var(--color-border)',
            boxShadow: 'var(--shadow-lg)',
            minWidth: '100px'
          }}
        >
          {years?.map((year) => (
            <button
              key={year}
              onClick={() => { onChange(year); setOpen(false); }}
              className="w-full text-left px-3 py-2 text-xs transition-all"
              style={{
                background: selectedYear === year ? 'rgba(212,175,55,0.12)' : 'transparent',
                color: selectedYear === year ? 'var(--color-primary)' : 'var(--color-text-primary)',
                fontFamily: 'var(--font-caption)',
                fontWeight: selectedYear === year ? 600 : 400
              }}
            >
              {year}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const MonthSelector = ({ selectedMonth, onChange }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (ref?.current && !ref?.current?.contains(e?.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
        style={{
          background: 'var(--color-surface-2)',
          border: '1px solid var(--color-border)',
          color: 'var(--color-text-primary)',
          fontFamily: 'var(--font-caption)',
          height: '34px'
        }}
      >
        <Icon name="CalendarDays" size={13} color="var(--color-primary)" />
        <span>{MONTH_NAMES?.[selectedMonth]?.slice(0, 3)}</span>
        <Icon name={open ? 'ChevronUp' : 'ChevronDown'} size={12} color="var(--color-text-secondary)" />
      </button>
      {open && (
        <div
          className="absolute right-0 mt-1 rounded-lg overflow-hidden z-50"
          style={{
            background: 'var(--color-card)',
            border: '1px solid var(--color-border)',
            boxShadow: 'var(--shadow-lg)',
            minWidth: '120px',
            maxHeight: '240px',
            overflowY: 'auto'
          }}
        >
          {MONTH_NAMES?.map((name, idx) => (
            <button
              key={name}
              onClick={() => { onChange(idx); setOpen(false); }}
              className="w-full text-left px-3 py-2 text-xs transition-all"
              style={{
                background: selectedMonth === idx ? 'rgba(212,175,55,0.12)' : 'transparent',
                color: selectedMonth === idx ? 'var(--color-primary)' : 'var(--color-text-primary)',
                fontFamily: 'var(--font-caption)',
                fontWeight: selectedMonth === idx ? 600 : 400
              }}
            >
              {name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// ─── Data computation helpers ───────────────────────────────────────────────

const filterEntries = (entries, period, year, month) => {
  if (period === 'all') return entries;
  if (period === 'year') return entries?.filter((e) => {
    const y = e?.watch_date ? new Date(e.watch_date)?.getFullYear() : null;
    return y === year;
  });
  if (period === 'month') return entries?.filter((e) => {
    if (!e?.watch_date) return false;
    const d = new Date(e.watch_date);
    return d?.getFullYear() === year && d?.getMonth() === month;
  });
  return entries;
};

const computeYearlyStats = (entries) => {
  const totalMovies = entries?.length || 0;
  const ticketCost = entries?.reduce((s, e) => s + (parseFloat(e?.cost_ticket) || 0), 0);
  const snacks = {
    popcorn: entries?.reduce((s, e) => s + (parseFloat(e?.cost_popcorn) || 0), 0),
    coke: entries?.reduce((s, e) => s + (parseFloat(e?.cost_coke) || 0), 0),
    donut: entries?.reduce((s, e) => s + (parseFloat(e?.cost_snacks) || 0), 0),
    puffs: entries?.reduce((s, e) => s + (parseFloat(e?.cost_puffs) || 0), 0),
    vadaPaav: entries?.reduce((s, e) => s + (parseFloat(e?.cost_vada_paav) || 0), 0),
    water: entries?.reduce((s, e) => s + (parseFloat(e?.cost_water) || 0), 0),
    samosaChat: entries?.reduce((s, e) => s + (parseFloat(e?.cost_samosa_chat) || 0), 0),
    nachos: entries?.reduce((s, e) => s + (parseFloat(e?.cost_nachos) || 0), 0),
    hotDog: entries?.reduce((s, e) => s + (parseFloat(e?.cost_hot_dog) || 0), 0),
    coffee: entries?.reduce((s, e) => s + (parseFloat(e?.cost_coffee) || 0), 0),
    pressedJuice: entries?.reduce((s, e) => s + (parseFloat(e?.cost_pressed_juice) || 0), 0),
  };
  const parking = entries?.reduce((s, e) => s + (parseFloat(e?.cost_parking) || 0), 0);
  const bookingCharges = entries?.reduce((s, e) => s + (parseFloat(e?.cost_booking_charges) || 0), 0);
  const tax = entries?.reduce((s, e) => s + (parseFloat(e?.cost_tax) || 0), 0);
  const tickets = entries?.reduce((s, e) => s + (parseInt(e?.ticket_count) || 1), 0);
  const openingDay = entries?.filter((e) => e?.is_opening_day)?.length || 0;
  const movies3d = entries?.filter((e) => e?.is_3d)?.length || 0;
  const theatreSet = new Set(entries?.map((e) => e?.theatre)?.filter(Boolean));
  return { movies: totalMovies, ticketCost, snacks, parking, bookingCharges, tax, tickets, openingDay, movies3d, theatres: theatreSet?.size };
};

const computeSpendingBreakdown = (entries, period, year) => {
  if (period === 'month') return null;
  const months = MONTH_NAMES_SHORT?.map((m, idx) => {
    const monthEntries = entries?.filter((e) => {
      if (!e?.watch_date) return false;
      const d = new Date(e.watch_date);
      if (period === 'year') return d?.getFullYear() === year && d?.getMonth() === idx;
      return d?.getMonth() === idx;
    });
    const tickets = monthEntries?.reduce((s, e) => s + (parseFloat(e?.cost_ticket) || 0), 0);
    const food = monthEntries?.reduce((s, e) => {
      return s + (parseFloat(e?.cost_popcorn) || 0) + (parseFloat(e?.cost_coke) || 0)
        + (parseFloat(e?.cost_puffs) || 0) + (parseFloat(e?.cost_vada_paav) || 0)
        + (parseFloat(e?.cost_water) || 0) + (parseFloat(e?.cost_samosa_chat) || 0)
        + (parseFloat(e?.cost_nachos) || 0) + (parseFloat(e?.cost_hot_dog) || 0)
        + (parseFloat(e?.cost_coffee) || 0) + (parseFloat(e?.cost_pressed_juice) || 0)
        + (parseFloat(e?.cost_snacks) || 0);
    }, 0);
    const parking = monthEntries?.reduce((s, e) => s + (parseFloat(e?.cost_parking) || 0), 0);
    const total = tickets + food + parking;
    return { month: m, tickets: parseFloat(tickets?.toFixed(2)), food: parseFloat(food?.toFixed(2)), parking: parseFloat(parking?.toFixed(2)), total: parseFloat(total?.toFixed(2)) };
  });
  return months;
};

const computeMonthSpendingBreakdown = (entries) => {
  const tickets = entries?.reduce((s, e) => s + (parseFloat(e?.cost_ticket) || 0), 0);
  const food = entries?.reduce((s, e) => {
    return s + (parseFloat(e?.cost_popcorn) || 0) + (parseFloat(e?.cost_coke) || 0)
      + (parseFloat(e?.cost_puffs) || 0) + (parseFloat(e?.cost_vada_paav) || 0)
      + (parseFloat(e?.cost_water) || 0) + (parseFloat(e?.cost_samosa_chat) || 0)
      + (parseFloat(e?.cost_nachos) || 0) + (parseFloat(e?.cost_hot_dog) || 0)
      + (parseFloat(e?.cost_coffee) || 0) + (parseFloat(e?.cost_pressed_juice) || 0)
      + (parseFloat(e?.cost_snacks) || 0);
  }, 0);
  const parking = entries?.reduce((s, e) => s + (parseFloat(e?.cost_parking) || 0), 0);
  const total = tickets + food + parking;
  return { tickets: parseFloat(tickets?.toFixed(2)), food: parseFloat(food?.toFixed(2)), parking: parseFloat(parking?.toFixed(2)), total: parseFloat(total?.toFixed(2)) };
};

const computeDistribution = (entries) => {
  const tickets = entries?.reduce((s, e) => s + (parseFloat(e?.cost_ticket) || 0), 0);
  const food = entries?.reduce((s, e) => {
    return s + (parseFloat(e?.cost_popcorn) || 0) + (parseFloat(e?.cost_coke) || 0)
      + (parseFloat(e?.cost_puffs) || 0) + (parseFloat(e?.cost_vada_paav) || 0)
      + (parseFloat(e?.cost_water) || 0) + (parseFloat(e?.cost_samosa_chat) || 0)
      + (parseFloat(e?.cost_nachos) || 0) + (parseFloat(e?.cost_hot_dog) || 0)
      + (parseFloat(e?.cost_coffee) || 0) + (parseFloat(e?.cost_pressed_juice) || 0)
      + (parseFloat(e?.cost_snacks) || 0);
  }, 0);
  const parking = entries?.reduce((s, e) => s + (parseFloat(e?.cost_parking) || 0), 0);
  const bookingFees = entries?.reduce((s, e) => s + (parseFloat(e?.cost_booking_charges) || 0), 0);
  const tax = entries?.reduce((s, e) => s + (parseFloat(e?.cost_tax) || 0), 0);
  return [
    { name: 'Tickets', value: parseFloat(tickets?.toFixed(2)), color: '#D4AF37' },
    { name: 'Food & Drinks', value: parseFloat(food?.toFixed(2)), color: '#FF6B6B' },
    { name: 'Parking', value: parseFloat(parking?.toFixed(2)), color: '#4ECDC4' },
    { name: 'Booking Fees', value: parseFloat(bookingFees?.toFixed(2)), color: '#F97316' },
    { name: 'Tax', value: parseFloat(tax?.toFixed(2)), color: '#FFE66D' },
  ];
};

const computeTheatres = (entries) => {
  const map = {};
  entries?.forEach((e) => {
    if (!e?.theatre) return;
    if (!map?.[e?.theatre]) map[e.theatre] = { name: e?.theatre, visits: 0, spent: 0 };
    map[e.theatre].visits += 1;
    map[e.theatre].spent += parseFloat(e?.total_cost) || 0;
  });
  return Object.values(map)
    ?.map((t) => ({ ...t, spent: parseFloat(t?.spent?.toFixed(2)), avgCost: t?.visits > 0 ? parseFloat((t?.spent / t?.visits)?.toFixed(2)) : 0 }))
    ?.sort((a, b) => b?.visits - a?.visits);
};

const computeLanguages = (entries) => {
  const map = {};
  entries?.forEach((e) => {
    const lang = e?.language || 'Unknown';
    map[lang] = (map?.[lang] || 0) + 1;
  });
  const total = entries?.length || 0;
  return Object.entries(map)
    ?.map(([language, count]) => ({ language, count, percent: total > 0 ? Math.round((count / total) * 100) : 0 }))
    ?.sort((a, b) => b?.count - a?.count);
};

const computeCompanions = (entries) => {
  const map = {};
  entries?.forEach((e) => {
    if (!e?.companions) return;
    const names = e?.companions?.split(',')?.map((n) => n?.trim())?.filter(Boolean);
    names?.forEach((name) => {
      const key = name?.charAt(0)?.toUpperCase() + name?.slice(1);
      map[key] = (map?.[key] || 0) + 1;
    });
  });
  return Object.entries(map)
    ?.map(([name, count]) => ({ name, count }))
    ?.sort((a, b) => b?.count - a?.count);
};

const computePeakPatterns = (entries) => {
  const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const SLOTS = ['Morning', 'Afternoon', 'Evening', 'Night'];
  const dayMap = {}; DAYS?.forEach((d) => { dayMap[d] = 0; });
  const timeMap = {}; SLOTS?.forEach((s) => { timeMap[s] = 0; });

  entries?.forEach((e) => {
    if (e?.watch_date) {
      const d = new Date(e.watch_date);
      const dayIdx = d?.getDay(); // 0=Sun
      const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const dayName = dayNames?.[dayIdx];
      if (dayMap?.[dayName] !== undefined) dayMap[dayName] += 1;
    }
    if (e?.show_time) {
      const parts = e?.show_time?.split(':');
      const hour = parseInt(parts?.[0]) || 0;
      if (hour >= 6 && hour < 12) timeMap['Morning'] += 1;
      else if (hour >= 12 && hour < 17) timeMap['Afternoon'] += 1;
      else if (hour >= 17 && hour < 21) timeMap['Evening'] += 1;
      else timeMap['Night'] += 1;
    }
  });

  const dayData = DAYS?.map((d) => ({ day: d, movies: dayMap?.[d] || 0 }));
  const timeData = SLOTS?.map((s) => ({ slot: s, movies: timeMap?.[s] || 0 }));
  return { dayData, timeData };
};

const computeAvgCosts = (entries) => {
  const n = entries?.length || 0;
  if (n === 0) return [
    { label: 'Avg Ticket Cost', value: 0, icon: 'Ticket', color: 'var(--color-primary)' },
    { label: 'Avg Food & Drinks', value: 0, icon: 'Coffee', color: 'var(--color-accent)' },
    { label: 'Avg Parking', value: 0, icon: 'Car', color: 'var(--color-success)' },
    { label: 'Avg Booking Fee', value: 0, icon: 'CreditCard', color: '#F97316' },
    { label: 'Avg Tax', value: 0, icon: 'Receipt', color: '#FFE66D' },
    { label: 'Avg Total / Movie', value: 0, icon: 'TrendingUp', color: 'var(--color-primary)' },
  ];
  const ticket = entries?.reduce((s, e) => s + (parseFloat(e?.cost_ticket) || 0), 0) / n;
  const food = entries?.reduce((s, e) => {
    return s + (parseFloat(e?.cost_popcorn) || 0) + (parseFloat(e?.cost_coke) || 0)
      + (parseFloat(e?.cost_puffs) || 0) + (parseFloat(e?.cost_vada_paav) || 0)
      + (parseFloat(e?.cost_water) || 0) + (parseFloat(e?.cost_samosa_chat) || 0)
      + (parseFloat(e?.cost_nachos) || 0) + (parseFloat(e?.cost_hot_dog) || 0)
      + (parseFloat(e?.cost_coffee) || 0) + (parseFloat(e?.cost_pressed_juice) || 0)
      + (parseFloat(e?.cost_snacks) || 0);
  }, 0) / n;
  const parking = entries?.reduce((s, e) => s + (parseFloat(e?.cost_parking) || 0), 0) / n;
  const fee = entries?.reduce((s, e) => s + (parseFloat(e?.cost_booking_charges) || 0), 0) / n;
  const tax = entries?.reduce((s, e) => s + (parseFloat(e?.cost_tax) || 0), 0) / n;
  const total = entries?.reduce((s, e) => s + (parseFloat(e?.total_cost) || 0), 0) / n;
  return [
    { label: 'Avg Ticket Cost', value: parseFloat(ticket?.toFixed(2)), icon: 'Ticket', color: 'var(--color-primary)' },
    { label: 'Avg Food & Drinks', value: parseFloat(food?.toFixed(2)), icon: 'Coffee', color: 'var(--color-accent)' },
    { label: 'Avg Parking', value: parseFloat(parking?.toFixed(2)), icon: 'Car', color: 'var(--color-success)' },
    { label: 'Avg Booking Fee', value: parseFloat(fee?.toFixed(2)), icon: 'CreditCard', color: '#F97316' },
    { label: 'Avg Tax', value: parseFloat(tax?.toFixed(2)), icon: 'Receipt', color: '#FFE66D' },
    { label: 'Avg Total / Movie', value: parseFloat(total?.toFixed(2)), icon: 'TrendingUp', color: 'var(--color-primary)' },
  ];
};

// ─── Main Component ──────────────────────────────────────────────────────────

const Analytics = () => {
  const { user } = useAuth();
  const [period, setPeriod] = useState('year');
  const [exportOpen, setExportOpen] = useState(false);
  const [selectedYear, setSelectedYear] = useState(CURRENT_YEAR);
  const [selectedMonth, setSelectedMonth] = useState(CURRENT_MONTH);
  const [allEntries, setAllEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [availableYears, setAvailableYears] = useState([CURRENT_YEAR]);

  const fetchEntries = useCallback(async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const { data, error } = await supabase?.from('movie_entries')?.select('*')?.eq('user_id', user?.id)?.order('watch_date', { ascending: false });
      if (error) throw error;
      setAllEntries(data || []);
      // Compute available years from actual data
      const years = [...new Set((data || [])?.map((e) => e?.watch_date ? new Date(e.watch_date)?.getFullYear() : null)?.filter(Boolean))]?.sort((a, b) => b - a);
      if (years?.length > 0) {
        setAvailableYears(years);
        if (!years?.includes(selectedYear)) setSelectedYear(years?.[0]);
      } else {
        setAvailableYears([CURRENT_YEAR]);
      }
    } catch (err) {
      console.error('Analytics fetch error:', err);
      setAllEntries([]);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => { fetchEntries(); }, [fetchEntries]);

  // Compute filtered entries for current period/year/month
  const filteredEntries = filterEntries(allEntries, period, selectedYear, selectedMonth);

  // Compute all analytics data from filtered entries
  const yearlyStats = computeYearlyStats(filteredEntries);
  const spendingBreakdownData = period === 'month'
    ? computeMonthSpendingBreakdown(filteredEntries)
    : computeSpendingBreakdown(allEntries, period, selectedYear);
  const distributionData = computeDistribution(filteredEntries);
  const theatreData = computeTheatres(filteredEntries);
  const languageData = computeLanguages(filteredEntries);
  const peakPatterns = computePeakPatterns(filteredEntries);
  const avgCostData = computeAvgCosts(filteredEntries);
  const companionsData = computeCompanions(filteredEntries);

  return (
    <div className="min-h-screen" style={{ background: 'var(--color-background)' }}>
      <TopNavigation />

      <main className="pt-16 pb-20 md:pb-8 px-4 md:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-5 md:py-7">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text-primary)' }}>
              Analytics
            </h1>
            <p className="text-sm mt-1" style={{ color: 'var(--color-text-secondary)', fontFamily: 'var(--font-caption)' }}>
              Insights into your cinema habits &amp; spending patterns
            </p>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            {period === 'month' && (
              <MonthSelector selectedMonth={selectedMonth} onChange={setSelectedMonth} />
            )}
            {period !== 'all' && (
              <YearSelector selectedYear={selectedYear} onChange={setSelectedYear} availableYears={availableYears} />
            )}
            <PeriodSelector selected={period} onChange={setPeriod} />
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-24">
            <div className="flex flex-col items-center gap-3">
              <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: 'var(--color-primary)', borderTopColor: 'transparent' }} />
              <p className="text-sm" style={{ color: 'var(--color-text-secondary)', fontFamily: 'var(--font-caption)' }}>Loading analytics...</p>
            </div>
          </div>
        ) : (
          <>
            {/* Yearly Stats */}
            <section className="mb-6">
              <YearlyStatsPanel
                stats={yearlyStats}
                period={period}
                year={selectedYear}
                month={selectedMonth}
              />
            </section>

            {/* Spending Breakdown Chart */}
            <section className="mb-6">
              <SpendingBreakdownChart
                period={period}
                year={selectedYear}
                month={selectedMonth}
                data={spendingBreakdownData}
              />
            </section>

            {/* Distribution + Theatre Ranking */}
            <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <SpendingDistributionChart
                year={selectedYear}
                period={period}
                month={selectedMonth}
                distributionData={distributionData}
              />
              <TheatreRankingPanel
                year={selectedYear}
                period={period}
                month={selectedMonth}
                theatres={theatreData}
              />
            </section>

            {/* Avg Cost Analysis */}
            <section className="mb-6">
              <AvgCostAnalysis
                year={selectedYear}
                period={period}
                month={selectedMonth}
                costItems={avgCostData}
              />
            </section>

            {/* Language + Peak Patterns */}
            <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <LanguagePreferencePanel
                year={selectedYear}
                period={period}
                month={selectedMonth}
                languages={languageData}
              />
              <PeakViewingPatterns
                year={selectedYear}
                period={period}
                month={selectedMonth}
                dayData={peakPatterns?.dayData}
                timeData={peakPatterns?.timeData}
              />
            </section>

            {/* Companions Panel */}
            <section className="mb-6">
              <CompanionsPanel
                year={selectedYear}
                period={period}
                month={selectedMonth}
                companions={companionsData}
              />
            </section>

            {/* Streaks Panel */}
            <section className="mb-6">
              <StreaksPanel entries={allEntries} />
            </section>

            {/* Export CTA Banner */}
            <section className="rounded-xl p-5 md:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              style={{ background: 'linear-gradient(135deg, rgba(212,175,55,0.12), rgba(255,107,107,0.08))', border: '1px solid rgba(212,175,55,0.25)' }}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(212,175,55,0.15)', border: '1px solid rgba(212,175,55,0.3)' }}>
                  <Icon name="FileDown" size={20} color="var(--color-primary)" strokeWidth={1.5} />
                </div>
                <div>
                  <p className="text-sm font-semibold" style={{ color: 'var(--color-text-primary)', fontFamily: 'var(--font-caption)' }}>
                    Export Your Data
                  </p>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--color-text-secondary)', fontFamily: 'var(--font-caption)' }}>
                    Download as CSV, JSON, or PDF with custom date ranges
                  </p>
                </div>
              </div>
              <Button
                variant="default"
                size="sm"
                iconName="Download"
                iconPosition="left"
                iconSize={15}
                onClick={() => setExportOpen(true)}
              >
                Export Data
              </Button>
            </section>
          </>
        )}
      </main>

      <QuickActionButton />
      <DataExportModal isOpen={exportOpen} onClose={() => setExportOpen(false)} analyticsData={allEntries} />
    </div>
  );
};

export default Analytics;