import React from 'react';
import Icon from 'components/AppIcon';
import Button from 'components/ui/Button';
import Select from 'components/ui/Select';

const MONTH_OPTIONS = [
  { value: '', label: 'All Months' },
  { value: '1', label: 'January' }, { value: '2', label: 'February' },
  { value: '3', label: 'March' }, { value: '4', label: 'April' },
  { value: '5', label: 'May' }, { value: '6', label: 'June' },
  { value: '7', label: 'July' }, { value: '8', label: 'August' },
  { value: '9', label: 'September' }, { value: '10', label: 'October' },
  { value: '11', label: 'November' }, { value: '12', label: 'December' },
];

const SORT_OPTIONS = [
  { value: 'date_desc', label: 'Date (Newest First)' },
  { value: 'date_asc', label: 'Date (Oldest First)' },
  { value: 'cost_desc', label: 'Cost (Highest First)' },
  { value: 'cost_asc', label: 'Cost (Lowest First)' },
  { value: 'theatre_asc', label: 'Theatre (A-Z)' },
  { value: 'theatre_desc', label: 'Theatre (Z-A)' },
];

const MobileFilterPanel = ({ isOpen, filters, onFiltersChange, onClearFilters, onClose, languageOptions, theatreOptions, yearOptions }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div
        className="relative ml-auto w-80 max-w-full h-full flex flex-col overflow-y-auto"
        style={{ background: 'var(--color-card)', borderLeft: '1px solid var(--color-border)' }}
      >
        <div className="flex items-center justify-between p-4" style={{ borderBottom: '1px solid var(--color-border)' }}>
          <h3 className="text-base font-semibold" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text-primary)' }}>
            Filters &amp; Sort
          </h3>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-md"
            style={{ color: 'var(--color-text-secondary)' }}
            aria-label="Close filter panel"
          >
            <Icon name="X" size={18} />
          </button>
        </div>
        <div className="p-4 space-y-4 flex-1">
          <Select label="Language" options={languageOptions} value={filters?.language} onChange={(val) => onFiltersChange({ ...filters, language: val })} />
          <Select label="Theatre" options={theatreOptions} value={filters?.theatre} onChange={(val) => onFiltersChange({ ...filters, theatre: val })} />
          <Select label="Month" options={MONTH_OPTIONS} value={filters?.month} onChange={(val) => onFiltersChange({ ...filters, month: val })} />
          <Select label="Year" options={yearOptions} value={filters?.year} onChange={(val) => onFiltersChange({ ...filters, year: val })} />
          <Select label="Sort By" options={SORT_OPTIONS} value={filters?.sort} onChange={(val) => onFiltersChange({ ...filters, sort: val })} />
        </div>
        <div className="p-4 flex gap-3" style={{ borderTop: '1px solid var(--color-border)' }}>
          <Button variant="outline" fullWidth onClick={onClearFilters}>Clear All</Button>
          <Button variant="default" fullWidth onClick={onClose}>Apply</Button>
        </div>
      </div>
    </div>
  );
};

export default MobileFilterPanel;