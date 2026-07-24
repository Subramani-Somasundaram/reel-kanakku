import React, { useState } from 'react';

import Button from 'components/ui/Button';
import Input from 'components/ui/Input';
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

const FilterToolbar = ({ filters, onFiltersChange, onClearFilters, activeFilterCount, isMobile, isFilterPanelOpen, onToggleFilterPanel, languageOptions, theatreOptions, yearOptions }) => {
  const handleSearchChange = (e) => onFiltersChange({ ...filters, search: e?.target?.value });

  if (isMobile) {
    return (
      <div className="flex items-center gap-2 p-4" style={{ borderBottom: '1px solid var(--color-border)' }}>
        <div className="flex-1">
          <Input
            type="search"
            placeholder="Search movies, theatres..."
            value={filters?.search}
            onChange={handleSearchChange}
          />
        </div>
        <Button
          variant={activeFilterCount > 0 ? 'default' : 'outline'}
          size="sm"
          onClick={onToggleFilterPanel}
          iconName="SlidersHorizontal"
          iconPosition="left"
          iconSize={15}
        >
          Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
        </Button>
        {activeFilterCount > 0 && (
          <Button variant="ghost" size="sm" onClick={onClearFilters} iconName="X" iconPosition="left" iconSize={14}>
            Clear
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-5 space-y-3" style={{ borderBottom: '1px solid var(--color-border)' }}>
      <div className="flex flex-wrap items-end gap-3">
        <div className="flex-1 min-w-[200px]">
          <Input
            type="search"
            label="Search"
            placeholder="Search by movie name or theatre..."
            value={filters?.search}
            onChange={handleSearchChange}
          />
        </div>
        <div className="w-36">
          <Select
            label="Language"
            options={languageOptions}
            value={filters?.language}
            onChange={(val) => onFiltersChange({ ...filters, language: val })}
          />
        </div>
        <div className="w-44">
          <Select
            label="Theatre"
            options={theatreOptions}
            value={filters?.theatre}
            onChange={(val) => onFiltersChange({ ...filters, theatre: val })}
          />
        </div>
        <div className="w-36">
          <Select
            label="Month"
            options={MONTH_OPTIONS}
            value={filters?.month}
            onChange={(val) => onFiltersChange({ ...filters, month: val })}
          />
        </div>
        <div className="w-28">
          <Select
            label="Year"
            options={yearOptions}
            value={filters?.year}
            onChange={(val) => onFiltersChange({ ...filters, year: val })}
          />
        </div>
        <div className="w-48">
          <Select
            label="Sort By"
            options={SORT_OPTIONS}
            value={filters?.sort}
            onChange={(val) => onFiltersChange({ ...filters, sort: val })}
          />
        </div>
        {activeFilterCount > 0 && (
          <Button variant="ghost" size="sm" onClick={onClearFilters} iconName="X" iconPosition="left" iconSize={14} className="mb-0.5">
            Clear Filters ({activeFilterCount})
          </Button>
        )}
      </div>
    </div>
  );
};

export default FilterToolbar;