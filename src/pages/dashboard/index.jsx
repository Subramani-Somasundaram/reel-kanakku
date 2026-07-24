import React, { useMemo, useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import TopNavigation from "components/ui/TopNavigation";
import QuickActionButton from "components/ui/QuickActionButton";
import Icon from "components/AppIcon";
import Button from "components/ui/Button";
import SummaryWidget from "./components/SummaryWidget";
import RecentMovieCard from "./components/RecentMovieCard";
import SpendingBreakdown from "./components/SpendingBreakdown";
import QuickStats from "./components/QuickStats";
import TopTheatres from "./components/TopTheatres";
import StreakWidget from "./components/StreakWidget";
import { useCurrency } from "context/CurrencyContext";
import { supabase } from "lib/supabase";
import { useAuth } from "contexts/AuthContext";

const MONTH_NAMES_SHORT = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

const Dashboard = () => {
  const navigate = useNavigate();
  const { formatCurrency, formatCurrencyShort } = useCurrency();
  const { user } = useAuth();
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const fetchMovies = async () => {
      setLoading(true);
      const { data } = await supabase?.from('movie_entries')?.select('*')?.eq('user_id', user?.id)?.order('created_at', { ascending: false });
      if (data) {
        setMovies(data?.map((row) => ({
          id: row?.id,
          name: row?.movie_name,
          theatre: row?.theatre,
          date: row?.watch_date,
          language: row?.language,
          is3D: row?.is_3d,
          openingDay: row?.is_opening_day,
          tickets: row?.ticket_count,
          totalCost: parseFloat(row?.total_cost) || 0,
          screen: row?.screen_type,
          companions: row?.companions,
          showTime: row?.show_time,
          seatNo: row?.seat_numbers,
          paymentMode: row?.payment_mode,
          ticketCost: parseFloat(row?.cost_ticket) || 0,
          bookingCharges: parseFloat(row?.cost_booking_charges) || 0,
          tax: parseFloat(row?.cost_tax) || 0,
          parking: parseFloat(row?.cost_parking) || 0,
          popcorn: parseFloat(row?.cost_popcorn) || 0,
          coke: parseFloat(row?.cost_coke) || 0,
          snacks: parseFloat(row?.cost_snacks) || 0,
          puffs: parseFloat(row?.cost_puffs) || 0,
          vadaPaav: parseFloat(row?.cost_vada_paav) || 0,
          water: parseFloat(row?.cost_water) || 0,
          samosaChat: parseFloat(row?.cost_samosa_chat) || 0,
          nachos: parseFloat(row?.cost_nachos) || 0,
          hotDog: parseFloat(row?.cost_hot_dog) || 0,
          coffee: parseFloat(row?.cost_coffee) || 0,
          pressedJuice: parseFloat(row?.cost_pressed_juice) || 0,
          createdAt: row?.created_at,
        })));
      }
      setLoading(false);
    };
    fetchMovies();
  }, [user]);

  const currentYear = new Date()?.getFullYear();
  const currentMonth = new Date()?.getMonth(); // 0-indexed

  const yearMovies = useMemo(
    () => movies?.filter((m) => m?.date && m?.date?.startsWith(String(currentYear))),
    [movies, currentYear]
  );

  const monthlyMovies = useMemo(
    () => yearMovies?.filter((m) => {
      if (!m?.date) return false;
      const parts = m?.date?.split('-');
      return parseInt(parts?.[1], 10) === currentMonth + 1;
    }),
    [yearMovies, currentMonth]
  );

  const totalYearlySpend = useMemo(
    () => yearMovies?.reduce((sum, m) => sum + m?.totalCost, 0),
    [yearMovies]
  );

  const monthlySpend = useMemo(
    () => monthlyMovies?.reduce((sum, m) => sum + m?.totalCost, 0),
    [monthlyMovies]
  );

  const avgCostPerMovie = useMemo(
    () => (yearMovies?.length > 0 ? totalYearlySpend / yearMovies?.length : 0),
    [totalYearlySpend, yearMovies]
  );

  const theatreMap = useMemo(() => {
    const map = {};
    yearMovies?.forEach((m) => {
      if (m?.theatre) map[m.theatre] = (map?.[m?.theatre] || 0) + 1;
    });
    return Object.entries(map)?.map(([name, visits]) => ({ name, visits }))?.sort((a, b) => b?.visits - a?.visits);
  }, [yearMovies]);

  const recentMovies = useMemo(
    () => [...movies]?.slice(0, 6)?.map((m, i) => ({ ...m, index: i + 1 })),
    [movies]
  );

  // Build monthly spending data for chart (current year)
  const monthlyData = useMemo(() => {
    return MONTH_NAMES_SHORT?.map((month, idx) => {
      const amount = yearMovies?.filter((m) => {
          if (!m?.date) return false;
          return parseInt(m?.date?.split('-')?.[1], 10) === idx + 1;
        })?.reduce((sum, m) => sum + m?.totalCost, 0);
      return { month, amount };
    });
  }, [yearMovies]);

  const quickStats = [
    {
      label: "Avg. Cost / Movie",
      value: formatCurrency(avgCostPerMovie),
      icon: "IndianRupee",
      color: "var(--color-primary)",
    },
    {
      label: "Total Tickets",
      value: yearMovies?.reduce((s, m) => s + (m?.tickets || 0), 0),
      icon: "Ticket",
      color: "var(--color-success)",
    },
    {
      label: "3D Movies",
      value: yearMovies?.filter((m) => m?.is3D)?.length,
      icon: "Glasses",
      color: "var(--color-accent)",
    },
    {
      label: "Opening Day",
      value: yearMovies?.filter((m) => m?.openingDay)?.length,
      icon: "Star",
      color: "var(--color-warning)",
    },
    {
      label: "Most Visited",
      value: theatreMap?.[0]?.name?.split(" ")?.slice(0, 2)?.join(" ") || "—",
      icon: "Building2",
      color: "var(--color-secondary)",
    },
  ];

  // Spend breakdown totals
  const ticketsTotal = useMemo(() => yearMovies?.reduce((s, m) => s + m?.ticketCost, 0), [yearMovies]);
  const foodTotal = useMemo(() => yearMovies?.reduce((s, m) => s + m?.popcorn + m?.coke + m?.snacks + m?.nachos + m?.hotDog + m?.coffee + m?.water + m?.pressedJuice + m?.puffs + m?.vadaPaav + m?.samosaChat, 0), [yearMovies]);
  const parkingTotal = useMemo(() => yearMovies?.reduce((s, m) => s + m?.parking, 0), [yearMovies]);
  const feesTotal = useMemo(() => yearMovies?.reduce((s, m) => s + m?.bookingCharges + m?.tax, 0), [yearMovies]);
  const grandTotal = ticketsTotal + foodTotal + parkingTotal + feesTotal;

  const spendBreakdown = [
    { label: "Tickets", amount: ticketsTotal, color: "var(--color-primary)", pct: grandTotal > 0 ? Math.round((ticketsTotal / grandTotal) * 100) : 0 },
    { label: "Food & Drinks", amount: foodTotal, color: "var(--color-accent)", pct: grandTotal > 0 ? Math.round((foodTotal / grandTotal) * 100) : 0 },
    { label: "Parking", amount: parkingTotal, color: "var(--color-success)", pct: grandTotal > 0 ? Math.round((parkingTotal / grandTotal) * 100) : 0 },
    { label: "Fees & Tax", amount: feesTotal, color: "var(--color-secondary)", pct: grandTotal > 0 ? Math.round((feesTotal / grandTotal) * 100) : 0 },
  ];

  return (
    <div
      className="min-h-screen"
      style={{ background: "var(--color-background)" }}
    >
      <TopNavigation />
      {/* Main content */}
      <main className="pt-16 pb-20 md:pb-8 px-4 md:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="flex items-center justify-between gap-4 py-5 md:py-6 lg:py-8">
          <div>
            <h1
              className="text-2xl md:text-3xl lg:text-4xl font-bold"
              style={{ fontFamily: "var(--font-heading)", color: "var(--color-text-primary)" }}
            >
              Dashboard
            </h1>
            <p
              className="text-sm md:text-base mt-1"
              style={{ fontFamily: "var(--font-caption)", color: "var(--color-text-secondary)" }}
            >
              Your cinema tracking overview &middot; {MONTH_NAMES_SHORT?.[currentMonth]} {currentYear}
            </p>
          </div>
          <div className="hidden md:flex items-center gap-2">
            <Button
              variant="default"
              size="sm"
              iconName="Plus"
              iconPosition="left"
              iconSize={16}
              onClick={() => navigate("/add-movie-entry")}
            >
              Add Entry
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: 'var(--color-primary)', borderTopColor: 'transparent' }} />
              <span className="text-sm" style={{ fontFamily: 'var(--font-caption)', color: 'var(--color-text-secondary)' }}>Loading dashboard...</span>
            </div>
          </div>
        ) : (
          <>
            {/* Summary Widgets */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 lg:gap-5 mb-5 md:mb-6">
              <SummaryWidget
                title="Movies This Year"
                value={yearMovies?.length}
                subtitle={`Jan – ${MONTH_NAMES_SHORT?.[currentMonth]} ${currentYear}`}
                icon="Film"
                trend={undefined}
                trendValue={undefined}
                accentColor="var(--color-primary)"
              />
              <SummaryWidget
                title="Movies This Month"
                value={monthlyMovies?.length}
                subtitle={`${MONTH_NAMES_SHORT?.[currentMonth]} ${currentYear}`}
                icon="Calendar"
                trend={undefined}
                trendValue={undefined}
                accentColor="var(--color-success)"
              />
              <SummaryWidget
                title="Yearly Spend"
                value={formatCurrency(totalYearlySpend)}
                subtitle={`Total ${currentYear}`}
                icon="TrendingUp"
                trend={undefined}
                trendValue={undefined}
                accentColor="var(--color-accent)"
              />
              <SummaryWidget
                title="Monthly Spend"
                value={formatCurrencyShort(monthlySpend)}
                subtitle={`${MONTH_NAMES_SHORT?.[currentMonth]} ${currentYear}`}
                icon="Wallet"
                accentColor="var(--color-warning)"
                trend={undefined}
                trendValue={undefined}
              />
            </div>

            {/* Monthly Spend + Streaks Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5 mb-5 md:mb-6">
              {/* Monthly Spend Detail */}
              <div
                className="rounded-xl p-4 md:p-5"
                style={{
                  background: "var(--color-card)",
                  border: "1px solid var(--color-border)",
                  boxShadow: "var(--shadow-md)",
                }}
              >
                <div className="flex items-center gap-2 mb-4">
                  <Icon name="Wallet" size={18} color="var(--color-warning)" strokeWidth={1.8} />
                  <h3
                    className="text-base font-semibold"
                    style={{ fontFamily: "var(--font-heading)", color: "var(--color-text-primary)" }}
                  >
                    Monthly Spend
                  </h3>
                  <span
                    className="ml-auto text-xs px-2 py-0.5 rounded-full"
                    style={{ background: "rgba(212,175,55,0.12)", color: "var(--color-warning)", fontFamily: "var(--font-caption)" }}
                  >
                    {MONTH_NAMES_SHORT?.[currentMonth]} {currentYear}
                  </span>
                </div>
                <div className="flex items-end gap-2 mb-4">
                  <span
                    className="text-3xl font-bold"
                    style={{ fontFamily: "var(--font-data)", color: "var(--color-text-primary)" }}
                  >
                    {formatCurrency(monthlySpend)}
                  </span>
                  <span
                    className="text-sm mb-1"
                    style={{ fontFamily: "var(--font-caption)", color: "var(--color-text-secondary)" }}
                  >
                    this month
                  </span>
                </div>
                <div className="space-y-2">
                  {spendBreakdown?.map((item, i) => (
                    <div key={i}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs" style={{ fontFamily: "var(--font-caption)", color: "var(--color-text-secondary)" }}>
                          {item?.label}
                        </span>
                        <span className="text-xs font-semibold" style={{ fontFamily: "var(--font-data)", color: "var(--color-text-primary)" }}>
                          {formatCurrencyShort(item?.amount)}
                        </span>
                      </div>
                      <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ background: "var(--color-surface-2)" }}>
                        <div className="h-full rounded-full" style={{ width: `${item?.pct}%`, background: item?.color }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Streaks */}
              <StreakWidget movies={movies} />
            </div>

            {/* Main Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-5 lg:gap-6">
              {/* Left: Recent Entries */}
              <div className="lg:col-span-2 space-y-4">
                <div
                  className="rounded-xl p-4 md:p-5 lg:p-6"
                  style={{
                    background: "var(--color-card)",
                    border: "1px solid var(--color-border)",
                    boxShadow: "var(--shadow-md)",
                  }}
                >
                  <div className="flex items-center justify-between mb-4 gap-2">
                    <div className="flex items-center gap-2">
                      <Icon name="Clock" size={18} color="var(--color-primary)" strokeWidth={1.8} />
                      <h2
                        className="text-base md:text-lg font-semibold"
                        style={{ fontFamily: "var(--font-heading)", color: "var(--color-text-primary)" }}
                      >
                        Recent Movies
                      </h2>
                    </div>
                    <Button
                      variant="ghost"
                      size="xs"
                      iconName="ArrowRight"
                      iconPosition="right"
                      iconSize={14}
                      onClick={() => navigate("/movie-history")}
                    >
                      View All
                    </Button>
                  </div>
                  {recentMovies?.length === 0 ? (
                    <p className="text-sm text-center py-8" style={{ fontFamily: 'var(--font-caption)', color: 'var(--color-text-secondary)' }}>
                      No movies yet. <button onClick={() => navigate('/add-movie-entry')} style={{ color: 'var(--color-primary)' }}>Add your first entry</button>
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {recentMovies?.map((movie) => (
                        <RecentMovieCard key={movie?.id} movie={movie} />
                      ))}
                    </div>
                  )}
                </div>

                {/* Spending Chart */}
                <SpendingBreakdown
                  monthlyData={monthlyData}
                  currentMonthIndex={currentMonth}
                />
              </div>

              {/* Right: Stats Panel */}
              <div className="space-y-4">
                <QuickStats stats={quickStats} />
                <TopTheatres theatres={theatreMap} />

                {/* Cost Breakdown Card */}
                <div
                  className="rounded-xl p-4 md:p-5"
                  style={{
                    background: "var(--color-card)",
                    border: "1px solid var(--color-border)",
                    boxShadow: "var(--shadow-md)",
                  }}
                >
                  <div className="flex items-center gap-2 mb-4">
                    <Icon name="PieChart" size={18} color="var(--color-primary)" strokeWidth={1.8} />
                    <h3
                      className="text-base font-semibold"
                      style={{ fontFamily: "var(--font-heading)", color: "var(--color-text-primary)" }}
                    >
                      Spend Breakdown
                    </h3>
                  </div>
                  {spendBreakdown?.map((item, i) => (
                    <div key={i} className="mb-3 last:mb-0">
                      <div className="flex items-center justify-between mb-1">
                        <span
                          className="text-xs"
                          style={{ fontFamily: "var(--font-caption)", color: "var(--color-text-secondary)" }}
                        >
                          {item?.label}
                        </span>
                        <span
                          className="text-xs font-semibold"
                          style={{ fontFamily: "var(--font-data)", color: "var(--color-text-primary)" }}
                        >
                          {formatCurrencyShort(item?.amount)}
                        </span>
                      </div>
                      <div
                        className="w-full h-1.5 rounded-full overflow-hidden"
                        style={{ background: "var(--color-surface-2)" }}
                      >
                        <div
                          className="h-full rounded-full"
                          style={{ width: `${item?.pct}%`, background: item?.color }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Navigate to Analytics */}
                <button
                  className="w-full rounded-xl p-4 flex items-center justify-between gap-3 transition-all duration-250 group"
                  style={{
                    background: "rgba(212,175,55,0.08)",
                    border: "1px solid rgba(212,175,55,0.25)",
                  }}
                  onClick={() => navigate("/analytics")}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "rgba(212,175,55,0.14)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "rgba(212,175,55,0.08)";
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-9 h-9 rounded-lg flex items-center justify-center"
                      style={{ background: "rgba(212,175,55,0.15)" }}
                    >
                      <Icon name="BarChart2" size={18} color="var(--color-primary)" strokeWidth={1.8} />
                    </div>
                    <div className="text-left">
                      <p
                        className="text-sm font-semibold"
                        style={{ fontFamily: "var(--font-heading)", color: "var(--color-primary)" }}
                      >
                        Full Analytics
                      </p>
                      <p
                        className="text-xs"
                        style={{ fontFamily: "var(--font-caption)", color: "var(--color-text-secondary)" }}
                      >
                        Trends, exports &amp; insights
                      </p>
                    </div>
                  </div>
                  <Icon
                    name="ArrowRight"
                    size={16}
                    color="var(--color-primary)"
                    strokeWidth={2}
                    className="group-hover:translate-x-1 transition-transform duration-250"
                  />
                </button>
              </div>
            </div>
          </>
        )}
      </main>
      <QuickActionButton />
    </div>
  );
};

export default Dashboard;