import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TopNavigation from 'components/ui/TopNavigation';
import QuickActionButton from 'components/ui/QuickActionButton';
import Icon from 'components/AppIcon';
import Button from 'components/ui/Button';
import FilterToolbar from './components/FilterToolbar';
import MobileFilterPanel from './components/MobileFilterPanel';
import SummaryPanel from './components/SummaryPanel';
import MovieTableRow from './components/MovieTableRow';
import MovieCard from './components/MovieCard';
import EntryDetailPanel from './components/EntryDetailPanel';
import DeleteConfirmDialog from './components/DeleteConfirmDialog';
import BulkActionBar from './components/BulkActionBar';
import { supabase } from 'lib/supabase';
import { useAuth } from 'contexts/AuthContext';
import { useCurrency } from 'context/CurrencyContext';

// Map a DB row (snake_case) to the display shape (camelCase)
const mapDbRow = (row) => ({
  id: row?.id,
  movieName: row?.movie_name,
  date: row?.watch_date,
  showTime: row?.show_time,
  theatre: row?.theatre,
  screen: row?.screen_type,
  language: row?.language,
  companions: row?.companions,
  tickets: row?.ticket_count,
  is3D: row?.is_3d,
  openingDay: row?.is_opening_day,
  openingShow: row?.is_opening_show,
  seatNo: row?.seat_numbers,
  paymentMode: row?.payment_mode,
  popcornSize: row?.popcorn_size,
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
  totalCost: parseFloat(row?.total_cost) || 0,
  posterUrl: row?.poster_url || null,
});

const DEFAULT_FILTERS = { search: '', language: '', theatre: '', month: '', year: '', sort: 'date_desc' };
const VIEW_MODE_STORAGE_KEY = 'movieHistoryViewMode';

const getStoredViewMode = () => {
  try {
    const stored = localStorage.getItem(VIEW_MODE_STORAGE_KEY);
    return stored === 'grid' ? 'grid' : 'list';
  } catch {
    return 'list';
  }
};

const MovieHistory = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { currency } = useCurrency();
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState('');
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [expandedId, setExpandedId] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [viewMode, setViewMode] = useState(getStoredViewMode);

  React.useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(VIEW_MODE_STORAGE_KEY, viewMode);
    } catch {
      // ignore quota / private mode errors
    }
  }, [viewMode]);

  // Fetch entries from Supabase
  useEffect(() => {
    if (!user) return;
    const fetchEntries = async () => {
      setLoading(true);
      setFetchError('');
      const { data, error } = await supabase?.from('movie_entries')?.select('*')?.eq('user_id', user?.id)?.order('created_at', { ascending: false });
      if (error) {
        setFetchError(error?.message);
      } else {
        setEntries((data || [])?.map(mapDbRow));
      }
      setLoading(false);
    };
    fetchEntries();
  }, [user]);

  const activeFilterCount = useMemo(() => {
    return ['language', 'theatre', 'month', 'year', 'search']?.filter((k) => filters?.[k] !== '')?.length;
  }, [filters]);

  const filteredEntries = useMemo(() => {
    let result = [...entries];

    if (filters?.search) {
      const q = filters?.search?.toLowerCase();
      result = result?.filter((e) => e?.movieName?.toLowerCase()?.includes(q) || e?.theatre?.toLowerCase()?.includes(q));
    }
    if (filters?.language) result = result?.filter((e) => e?.language === filters?.language);
    if (filters?.theatre) result = result?.filter((e) => e?.theatre === filters?.theatre);
    if (filters?.month) {
      result = result?.filter((e) => {
        if (!e?.date) return false;
        const d = new Date(e?.date + 'T00:00:00');
        return (d?.getMonth() + 1) === parseInt(filters?.month, 10);
      });
    }
    if (filters?.year) {
      result = result?.filter((e) => {
        if (!e?.date) return false;
        const d = new Date(e?.date + 'T00:00:00');
        return String(d?.getFullYear()) === filters?.year;
      });
    }

    result?.sort((a, b) => {
      const parseDate = (d) => {
        if (!d) return new Date(0);
        return new Date(d + 'T00:00:00'); };
        
      switch (filters?.sort) {
        case 'date_asc': return parseDate(a?.date) - parseDate(b?.date);
        case 'date_desc': return parseDate(b?.date) - parseDate(a?.date);
        case 'cost_desc': return b?.totalCost - a?.totalCost;
        case 'cost_asc': return a?.totalCost - b?.totalCost;
        case 'theatre_asc': return a?.theatre?.localeCompare(b?.theatre);
        case 'theatre_desc': return b?.theatre?.localeCompare(a?.theatre);
        default: return parseDate(b?.date) - parseDate(a?.date);
      }
    });

    return result;
  }, [entries, filters]);

  const totalSpend = useMemo(() => filteredEntries?.reduce((sum, e) => sum + e?.totalCost, 0), [filteredEntries]);

  // Dynamic dropdown options derived from actual entries
  const languageOptions = useMemo(() => {
    const langs = [...new Set(entries?.map((e) => e?.language)?.filter(Boolean))]?.sort();
    return [{ value: '', label: 'All Languages' }, ...langs?.map((l) => ({ value: l, label: l ? l?.charAt(0)?.toUpperCase() + l?.slice(1) : l }))];
  }, [entries]);

  const theatreOptions = useMemo(() => {
    const theatres = [...new Set(entries?.map((e) => e?.theatre)?.filter(Boolean))]?.sort();
    return [{ value: '', label: 'All Theatres' }, ...theatres?.map((t) => ({ value: t, label: t }))];
  }, [entries]);

  const yearOptions = useMemo(() => {
    const years = [...new Set(entries?.map((e) => {
      if (!e?.date) return null;
      const d = new Date(e?.date + 'T00:00:00');
      return isNaN(d.getTime()) ? null : String(d.getFullYear());
    })?.filter(Boolean))]?.sort((a, b) => b - a);
    return [{ value: '', label: 'All Years' }, ...years?.map((y) => ({ value: y, label: y }))];
  }, [entries]);

  const handleToggleExpand = useCallback((id) => {
    setExpandedId((prev) => (prev === id ? null : id));
  }, []);

  const handleSelect = useCallback((id) => {
    setSelectedIds((prev) => prev?.includes(id) ? prev?.filter((x) => x !== id) : [...prev, id]);
  }, []);

  const handleSelectAll = useCallback(() => {
    setSelectedIds(filteredEntries?.map((e) => e?.id));
  }, [filteredEntries]);

  const handleDeselectAll = useCallback(() => setSelectedIds([]), []);

  const handleEdit = useCallback((entry) => {
    navigate('/add-movie-entry', { state: { entry } });
  }, [navigate]);

  const handleDuplicate = useCallback((entry) => {
    const newEntry = { ...entry, id: Date.now(), movieName: `${entry?.movieName} (Copy)`, openingDay: false, openingShow: false };
    setEntries((prev) => [newEntry, ...prev]);
  }, []);

  const handleDeleteRequest = useCallback((entry) => setDeleteTarget(entry), []);

  const handleDeleteConfirm = useCallback(async () => {
    if (deleteTarget) {
      const { error } = await supabase?.from('movie_entries')?.delete()?.eq('id', deleteTarget?.id);
      if (!error) {
        setEntries((prev) => prev?.filter((e) => e?.id !== deleteTarget?.id));
        setSelectedIds((prev) => prev?.filter((id) => id !== deleteTarget?.id));
        if (expandedId === deleteTarget?.id) setExpandedId(null);
      }
      setDeleteTarget(null);
    }
  }, [deleteTarget, expandedId]);

  const handleBulkDelete = useCallback(async () => {
    const { error } = await supabase?.from('movie_entries')?.delete()?.in('id', selectedIds);
    if (!error) {
      setEntries((prev) => prev?.filter((e) => !selectedIds?.includes(e?.id)));
      setSelectedIds([]);
    }
  }, [selectedIds]);

  const handleBulkExport = useCallback(() => {
    const selected = filteredEntries?.filter((e) => selectedIds?.includes(e?.id));
    const sym = currency?.symbol || '$';
    const csv = [
      'Movie Name,Date,Theatre,Language,Total Cost',
      ...selected?.map((e) => `"${e?.movieName}","${e?.date}","${e?.theatre}","${e?.language}","${sym}${e?.totalCost?.toFixed(2)}"`),
    ]?.join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'movie_history_export.csv';
    a?.click();
    URL.revokeObjectURL(url);
  }, [filteredEntries, selectedIds, currency]);

  const handleClearFilters = useCallback(() => setFilters(DEFAULT_FILTERS), []);

  return (
    <div className="min-h-screen" style={{ background: 'var(--color-background)' }}>
      <TopNavigation />
      {/* Page Content */}
      <main className="pt-16 pb-20 md:pb-8">
        <div className="max-w-screen-xl mx-auto px-4 md:px-6 lg:px-8 py-6 lg:py-8">

          {/* Page Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text-primary)' }}>
                Movie History
              </h1>
              <p className="text-sm mt-1" style={{ fontFamily: 'var(--font-caption)', color: 'var(--color-text-secondary)' }}>
                All your cinema experiences in one place
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div
                className="flex items-center rounded-lg p-0.5"
                style={{ background: 'var(--color-surface-2)', border: '1px solid var(--color-border)' }}
                role="group"
                aria-label="View mode"
              >
                <button
                  type="button"
                  onClick={() => setViewMode('list')}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-md text-xs font-medium transition-colors duration-150"
                  style={{
                    fontFamily: 'var(--font-caption)',
                    background: viewMode === 'list' ? 'var(--color-card)' : 'transparent',
                    color: viewMode === 'list' ? 'var(--color-primary)' : 'var(--color-text-secondary)',
                    boxShadow: viewMode === 'list' ? 'var(--shadow-sm)' : 'none',
                  }}
                  aria-pressed={viewMode === 'list'}
                >
                  <Icon name="List" size={15} strokeWidth={2} />
                  <span className="hidden sm:inline">List</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('grid')}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-md text-xs font-medium transition-colors duration-150"
                  style={{
                    fontFamily: 'var(--font-caption)',
                    background: viewMode === 'grid' ? 'var(--color-card)' : 'transparent',
                    color: viewMode === 'grid' ? 'var(--color-primary)' : 'var(--color-text-secondary)',
                    boxShadow: viewMode === 'grid' ? 'var(--shadow-sm)' : 'none',
                  }}
                  aria-pressed={viewMode === 'grid'}
                >
                  <Icon name="LayoutGrid" size={15} strokeWidth={2} />
                  <span className="hidden sm:inline">Grid</span>
                </button>
              </div>
              <Button
                variant="default"
                iconName="PlusCircle"
                iconPosition="left"
                iconSize={16}
                onClick={() => navigate('/add-movie-entry')}
              >
                Add Entry
              </Button>
            </div>
          </div>

          {/* Fetch Error */}
          {fetchError && (
            <div className="mb-4 p-3 rounded-lg text-sm" style={{ background: 'rgba(255,142,142,0.12)', border: '1px solid rgba(255,142,142,0.3)', color: 'var(--color-destructive)', fontFamily: 'var(--font-caption)' }}>
              {fetchError}
            </div>
          )}

          {/* Main Card */}
          <div className="rounded-xl overflow-hidden" style={{ background: 'var(--color-card)', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-lg)' }}>

            {/* Filter Toolbar */}
            <FilterToolbar
              filters={filters}
              onFiltersChange={setFilters}
              onClearFilters={handleClearFilters}
              activeFilterCount={activeFilterCount}
              isMobile={isMobile}
              isFilterPanelOpen={isFilterPanelOpen}
              onToggleFilterPanel={() => setIsFilterPanelOpen(true)}
              languageOptions={languageOptions}
              theatreOptions={theatreOptions}
              yearOptions={yearOptions}
            />

            {/* Bulk Action Bar */}
            <BulkActionBar
              selectedCount={selectedIds?.length}
              totalCount={filteredEntries?.length}
              onSelectAll={handleSelectAll}
              onDeselectAll={handleDeselectAll}
              onBulkExport={handleBulkExport}
              onBulkDelete={handleBulkDelete}
            />

            {/* Summary Panel */}
            <SummaryPanel
              totalCount={entries?.length}
              filteredCount={filteredEntries?.length}
              totalSpend={totalSpend}
              selectedCount={selectedIds?.length}
            />

            {/* Loading State */}
            {loading ? (
              <div className="flex items-center justify-center py-16">
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: 'var(--color-primary)', borderTopColor: 'transparent' }} />
                  <span className="text-sm" style={{ fontFamily: 'var(--font-caption)', color: 'var(--color-text-secondary)' }}>Loading entries...</span>
                </div>
              </div>
            ) : viewMode === 'list' ? (
              <div className="overflow-x-auto">
                {filteredEntries?.length === 0 ? (
                  <EmptyState onClear={handleClearFilters} hasFilters={activeFilterCount > 0} onAdd={() => navigate('/add-movie-entry')} />
                ) : (
                  <table className="w-full" style={{ borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ background: 'var(--color-surface-2)', borderBottom: '1px solid var(--color-border)' }}>
                        <th className="pl-4 pr-2 py-3 w-10">
                          <input
                            type="checkbox"
                            checked={selectedIds?.length === filteredEntries?.length && filteredEntries?.length > 0}
                            onChange={selectedIds?.length === filteredEntries?.length ? handleDeselectAll : handleSelectAll}
                            className="w-4 h-4 rounded cursor-pointer"
                            style={{ accentColor: 'var(--color-primary)' }}
                            aria-label="Select all entries"
                          />
                        </th>
                        {['Movie Name', 'Date', 'Theatre', 'Language', 'Companions', 'Total Cost', 'Actions']?.map((h, i) => (
                          <th
                            key={h}
                            className={`px-3 py-3 text-left text-xs font-semibold uppercase tracking-wider ${i === 3 ? 'hidden lg:table-cell' : ''} ${i === 4 ? 'hidden lg:table-cell' : ''} ${i === 2 ? 'hidden md:table-cell' : ''}`}
                            style={{ fontFamily: 'var(--font-caption)', color: 'var(--color-text-secondary)' }}
                          >
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {filteredEntries?.map((entry) => (
                        <MovieTableRow
                          key={entry?.id}
                          entry={entry}
                          isSelected={selectedIds?.includes(entry?.id)}
                          isExpanded={expandedId === entry?.id}
                          onSelect={handleSelect}
                          onToggleExpand={handleToggleExpand}
                          onEdit={handleEdit}
                          onDuplicate={handleDuplicate}
                          onDelete={handleDeleteRequest}
                        >
                          <EntryDetailPanel entry={entry} onClose={() => setExpandedId(null)} />
                        </MovieTableRow>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            ) : (
              <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredEntries?.length === 0 ? (
                  <div className="col-span-full">
                    <EmptyState onClear={handleClearFilters} hasFilters={activeFilterCount > 0} onAdd={() => navigate('/add-movie-entry')} />
                  </div>
                ) : (
                  filteredEntries?.map((entry) => (
                    <MovieCard
                      key={entry?.id}
                      entry={entry}
                      isSelected={selectedIds?.includes(entry?.id)}
                      onSelect={handleSelect}
                      onEdit={handleEdit}
                      onDuplicate={handleDuplicate}
                      onDelete={handleDeleteRequest}
                    />
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </main>
      {/* Mobile Filter Panel */}
      <MobileFilterPanel
        isOpen={isFilterPanelOpen}
        filters={filters}
        onFiltersChange={setFilters}
        onClearFilters={handleClearFilters}
        onClose={() => setIsFilterPanelOpen(false)}
        languageOptions={languageOptions}
        theatreOptions={theatreOptions}
        yearOptions={yearOptions}
      />
      {/* Delete Confirmation */}
      <DeleteConfirmDialog
        isOpen={!!deleteTarget}
        movieName={deleteTarget?.movieName || ''}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
      />
      <QuickActionButton />
    </div>
  );
};

const EmptyState = ({ onClear, hasFilters, onAdd }) => (
  <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
    <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4" style={{ background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.2)' }}>
      <Icon name="Film" size={28} color="var(--color-primary)" strokeWidth={1.5} />
    </div>
    <h3 className="text-lg font-semibold mb-2" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text-primary)' }}>
      {hasFilters ? 'No entries match your filters' : 'No movie entries yet'}
    </h3>
    <p className="text-sm mb-6 max-w-xs" style={{ fontFamily: 'var(--font-caption)', color: 'var(--color-text-secondary)' }}>
      {hasFilters ? 'Try adjusting or clearing your filters to see more results.' : 'Start tracking your cinema experiences by adding your first movie entry.'}
    </p>
    {hasFilters ? (
      <Button variant="outline" onClick={onClear} iconName="X" iconPosition="left" iconSize={15}>Clear Filters</Button>
    ) : (
      <Button variant="default" onClick={onAdd} iconName="PlusCircle" iconPosition="left" iconSize={15}>Add First Entry</Button>
    )}
  </div>
);

export default MovieHistory;
