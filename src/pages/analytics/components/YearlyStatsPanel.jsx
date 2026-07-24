import React from 'react';
import Icon from 'components/AppIcon';
import { useCurrency } from 'context/CurrencyContext';

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const SNACK_LABELS = [
  { key: 'popcorn', label: 'Popcorn', icon: 'Popcorn' },
  { key: 'coke', label: 'Coke', icon: 'GlassWater' },
  { key: 'donut', label: 'Donut', icon: 'Cookie' },
  { key: 'puffs', label: 'Puffs', icon: 'Wind' },
  { key: 'vadaPaav', label: 'Vada Paav', icon: 'Sandwich' },
  { key: 'water', label: 'Water', icon: 'Droplets' },
  { key: 'samosaChat', label: 'Samosa Chaat', icon: 'UtensilsCrossed' },
  { key: 'nachos', label: 'Nachos', icon: 'Layers' },
  { key: 'hotDog', label: 'Hot Dog', icon: 'Beef' },
  { key: 'coffee', label: 'Coffee', icon: 'Coffee' },
  { key: 'pressedJuice', label: 'Pressed Juice', icon: 'Citrus' },
];

const sumSnacks = (snacks) => {
  if (!snacks) return 0;
  return Object.values(snacks)?.reduce((a, b) => a + (b || 0), 0);
};

const YearlyStatsPanel = ({ stats = {}, period = 'year', year = new Date()?.getFullYear(), month = new Date()?.getMonth() }) => {
  const { formatCurrency } = useCurrency();

  let subtitle;
  if (period === 'month') subtitle = `${MONTH_NAMES?.[month]} ${year}`;
  else if (period === 'all') subtitle = 'All years combined';
  else subtitle = `${year} overview`;

  const snacks = stats?.snacks || {};
  const totalSnacksCost = sumSnacks(snacks);
  const totalTicketCost = stats?.ticketCost || 0;
  const totalParking = stats?.parking || 0;
  const totalBookingCharges = stats?.bookingCharges || 0;
  const totalTax = stats?.tax || 0;
  const totalTickets = stats?.tickets || 0;
  const totalMovies = stats?.movies || 0;
  const openingDay = stats?.openingDay || 0;
  const movies3d = stats?.movies3d || 0;
  const theatresCount = stats?.theatres || 0;
  const totalSpent = totalTicketCost + totalSnacksCost + totalParking + totalBookingCharges + totalTax;
  const avgCost = totalMovies > 0 ? totalSpent / totalMovies : 0;

  const summaryStats = [
    { label: 'Movies Watched', value: String(totalMovies), sub: period === 'all' ? 'All years combined' : period === 'month' ? MONTH_NAMES?.[month] : `${year}`, icon: 'Film', color: 'var(--color-primary)', bg: 'rgba(212,175,55,0.12)' },
    { label: 'Total Spent', value: null, raw: totalSpent, sub: 'All categories', icon: 'Wallet', color: 'var(--color-accent)', bg: 'rgba(255,107,107,0.12)' },
    { label: 'Avg Cost / Movie', value: null, raw: parseFloat(avgCost?.toFixed(2)), sub: 'Including food', icon: 'TrendingUp', color: 'var(--color-success)', bg: 'rgba(78,205,196,0.12)' },
    { label: 'Opening Day Watches', value: String(openingDay), sub: `${totalMovies > 0 ? Math.round((openingDay / totalMovies) * 100) : 0}% of movies`, icon: 'Zap', color: '#FFE66D', bg: 'rgba(255,230,109,0.12)' },
    { label: 'Theatres Visited', value: String(theatresCount), sub: 'Unique venues', icon: 'MapPin', color: '#8B7355', bg: 'rgba(139,115,85,0.12)' },
    { label: '3D Movies', value: String(movies3d), sub: `${totalMovies > 0 ? Math.round((movies3d / totalMovies) * 100) : 0}% of total`, icon: 'Glasses', color: 'var(--color-primary)', bg: 'rgba(212,175,55,0.12)' },
  ];

  if (totalMovies === 0) {
    return (
      <div className="rounded-xl p-4 md:p-6" style={{ background: 'var(--color-card)', border: '1px solid var(--color-border)' }}>
        <div className="mb-5">
          <h3 className="text-base md:text-lg font-semibold" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text-primary)' }}>
            {period === 'all' ? 'All-Time Statistics' : period === 'month' ? 'Monthly Statistics' : 'Yearly Statistics'}
          </h3>
          <p className="text-xs mt-0.5" style={{ color: 'var(--color-text-secondary)', fontFamily: 'var(--font-caption)' }}>{subtitle}</p>
        </div>
        <div className="flex flex-col items-center justify-center py-10 gap-3">
          <Icon name="Film" size={36} color="var(--color-text-secondary)" strokeWidth={1.5} />
          <p className="text-sm" style={{ color: 'var(--color-text-secondary)', fontFamily: 'var(--font-caption)' }}>No movies tracked for this period</p>
          <p className="text-xs" style={{ color: 'var(--color-text-secondary)', fontFamily: 'var(--font-caption)' }}>Add your first movie entry to see statistics here</p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl p-4 md:p-6" style={{ background: 'var(--color-card)', border: '1px solid var(--color-border)' }}>
      <div className="mb-5">
        <h3 className="text-base md:text-lg font-semibold" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text-primary)' }}>
          {period === 'all' ? 'All-Time Statistics' : period === 'month' ? 'Monthly Statistics' : 'Yearly Statistics'}
        </h3>
        <p className="text-xs mt-0.5" style={{ color: 'var(--color-text-secondary)', fontFamily: 'var(--font-caption)' }}>
          {subtitle}
        </p>
      </div>

      {/* Summary Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
        {summaryStats?.map((stat) => (
          <div key={stat?.label} className="rounded-lg p-3 md:p-4" style={{ background: 'var(--color-surface-2)', border: '1px solid var(--color-border)' }}>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-7 h-7 rounded-md flex items-center justify-center flex-shrink-0" style={{ background: stat?.bg }}>
                <Icon name={stat?.icon} size={14} color={stat?.color} strokeWidth={2} />
              </div>
            </div>
            <p className="text-lg md:text-xl font-bold" style={{ fontFamily: 'var(--font-data)', color: 'var(--color-text-primary)' }}>
              {stat?.raw !== undefined ? formatCurrency(stat?.raw) : stat?.value}
            </p>
            <p className="text-xs font-medium mt-0.5" style={{ color: 'var(--color-text-primary)', fontFamily: 'var(--font-caption)' }}>{stat?.label}</p>
            <p className="text-xs mt-0.5" style={{ color: 'var(--color-text-secondary)', fontFamily: 'var(--font-caption)' }}>{stat?.sub}</p>
          </div>
        ))}
      </div>

      {/* Cost Breakdown Section */}
      <div className="rounded-lg p-4" style={{ background: 'var(--color-surface-2)', border: '1px solid var(--color-border)' }}>
        <h4 className="text-sm font-semibold mb-4" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text-primary)' }}>
          Cost Breakdown
        </h4>

        {/* Snacks */}
        <div className="mb-4">
          <p className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: 'var(--color-text-secondary)', fontFamily: 'var(--font-caption)' }}>Snacks &amp; Beverages</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
            {SNACK_LABELS?.map(({ key, label, icon }) => (
              <div key={key} className="flex items-center justify-between rounded-md px-3 py-2" style={{ background: 'var(--color-card)', border: '1px solid var(--color-border)' }}>
                <div className="flex items-center gap-1.5 min-w-0">
                  <Icon name={icon} size={12} color="var(--color-primary)" strokeWidth={2} />
                  <span className="text-xs truncate" style={{ color: 'var(--color-text-secondary)', fontFamily: 'var(--font-caption)' }}>{label}</span>
                </div>
                <span className="text-xs font-semibold ml-2 flex-shrink-0" style={{ color: 'var(--color-text-primary)', fontFamily: 'var(--font-data)' }}>
                  {formatCurrency(snacks?.[key] || 0)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="border-t mb-4" style={{ borderColor: 'var(--color-border)' }} />

        {/* Totals */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          <div className="flex items-center justify-between rounded-md px-3 py-2" style={{ background: 'rgba(212,175,55,0.08)', border: '1px solid rgba(212,175,55,0.2)' }}>
            <div className="flex items-center gap-1.5">
              <Icon name="ShoppingBag" size={12} color="var(--color-primary)" strokeWidth={2} />
              <span className="text-xs" style={{ color: 'var(--color-text-secondary)', fontFamily: 'var(--font-caption)' }}>Total Snacks</span>
            </div>
            <span className="text-xs font-bold ml-2" style={{ color: 'var(--color-primary)', fontFamily: 'var(--font-data)' }}>{formatCurrency(totalSnacksCost)}</span>
          </div>
          <div className="flex items-center justify-between rounded-md px-3 py-2" style={{ background: 'rgba(78,205,196,0.08)', border: '1px solid rgba(78,205,196,0.2)' }}>
            <div className="flex items-center gap-1.5">
              <Icon name="Ticket" size={12} color="var(--color-success)" strokeWidth={2} />
              <span className="text-xs" style={{ color: 'var(--color-text-secondary)', fontFamily: 'var(--font-caption)' }}>Ticket Cost</span>
            </div>
            <span className="text-xs font-bold ml-2" style={{ color: 'var(--color-success)', fontFamily: 'var(--font-data)' }}>{formatCurrency(totalTicketCost)}</span>
          </div>
          <div className="flex items-center justify-between rounded-md px-3 py-2" style={{ background: 'rgba(139,115,85,0.08)', border: '1px solid rgba(139,115,85,0.2)' }}>
            <div className="flex items-center gap-1.5">
              <Icon name="Car" size={12} color="#8B7355" strokeWidth={2} />
              <span className="text-xs" style={{ color: 'var(--color-text-secondary)', fontFamily: 'var(--font-caption)' }}>Parking</span>
            </div>
            <span className="text-xs font-bold ml-2" style={{ color: '#8B7355', fontFamily: 'var(--font-data)' }}>{formatCurrency(totalParking)}</span>
          </div>
          <div className="flex items-center justify-between rounded-md px-3 py-2" style={{ background: 'rgba(255,230,109,0.08)', border: '1px solid rgba(255,230,109,0.2)' }}>
            <div className="flex items-center gap-1.5">
              <Icon name="CreditCard" size={12} color="#FFE66D" strokeWidth={2} />
              <span className="text-xs" style={{ color: 'var(--color-text-secondary)', fontFamily: 'var(--font-caption)' }}>Booking Charges</span>
            </div>
            <span className="text-xs font-bold ml-2" style={{ color: '#FFE66D', fontFamily: 'var(--font-data)' }}>{formatCurrency(totalBookingCharges)}</span>
          </div>
          <div className="flex items-center justify-between rounded-md px-3 py-2" style={{ background: 'rgba(255,107,107,0.08)', border: '1px solid rgba(255,107,107,0.2)' }}>
            <div className="flex items-center gap-1.5">
              <Icon name="Receipt" size={12} color="var(--color-accent)" strokeWidth={2} />
              <span className="text-xs" style={{ color: 'var(--color-text-secondary)', fontFamily: 'var(--font-caption)' }}>Total Tax</span>
            </div>
            <span className="text-xs font-bold ml-2" style={{ color: 'var(--color-accent)', fontFamily: 'var(--font-data)' }}>{formatCurrency(totalTax)}</span>
          </div>
          <div className="flex items-center justify-between rounded-md px-3 py-2" style={{ background: 'rgba(212,175,55,0.08)', border: '1px solid rgba(212,175,55,0.2)' }}>
            <div className="flex items-center gap-1.5">
              <Icon name="Hash" size={12} color="var(--color-primary)" strokeWidth={2} />
              <span className="text-xs" style={{ color: 'var(--color-text-secondary)', fontFamily: 'var(--font-caption)' }}>No. of Tickets</span>
            </div>
            <span className="text-xs font-bold ml-2" style={{ color: 'var(--color-primary)', fontFamily: 'var(--font-data)' }}>{totalTickets}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default YearlyStatsPanel;