import React from 'react';
import Icon from 'components/AppIcon';
import { useCurrency } from 'context/CurrencyContext';


const MovieTableRow = ({ entry, isSelected, isExpanded, onSelect, onToggleExpand, onEdit, onDuplicate, onDelete, children }) => {
  const { formatCurrency } = useCurrency();
  return (
    <>
      <tr
        className="transition-colors duration-150 cursor-pointer"
        style={{
          background: isExpanded ? 'rgba(212,175,55,0.05)' : isSelected ? 'rgba(212,175,55,0.04)' : 'transparent',
          borderBottom: '1px solid var(--color-border)',
        }}
        onClick={() => onToggleExpand(entry?.id)}
      >
        {/* Checkbox */}
        <td className="pl-4 pr-2 py-3 w-10" onClick={(e) => e?.stopPropagation()}>
          <input
            type="checkbox"
            checked={isSelected}
            onChange={() => onSelect(entry?.id)}
            className="w-4 h-4 rounded cursor-pointer"
            style={{ accentColor: 'var(--color-primary)' }}
            aria-label={`Select ${entry?.movieName}`}
          />
        </td>
        {/* Movie Name */}
        <td className="px-3 py-3">
          <div className="flex items-center gap-2 min-w-0">
            <div className="min-w-0">
              <p className="text-sm font-medium truncate max-w-[180px]" style={{ fontFamily: 'var(--font-body)', color: 'var(--color-text-primary)' }}>
                {entry?.movieName}
              </p>
              <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                {entry?.is3D && (
                  <span className="text-xs px-1.5 py-0.5 rounded" style={{ background: 'rgba(212,175,55,0.15)', color: 'var(--color-primary)', fontFamily: 'var(--font-caption)' }}>3D</span>
                )}
                {entry?.openingDay && entry?.openingShow && (
                  <span className="text-xs px-1.5 py-0.5 rounded" style={{ background: 'rgba(255,107,107,0.15)', color: 'var(--color-accent)', fontFamily: 'var(--font-caption)' }}>FDFS</span>
                )}
                {entry?.openingDay && !entry?.openingShow && (
                  <span className="text-xs px-1.5 py-0.5 rounded" style={{ background: 'rgba(34,197,94,0.15)', color: 'var(--color-success)', fontFamily: 'var(--font-caption)' }}>Opening Day</span>
                )}
              </div>
            </div>
          </div>
        </td>
        {/* Date */}
        <td className="px-3 py-3 whitespace-nowrap">
          <span className="text-sm" style={{ fontFamily: 'var(--font-data)', color: 'var(--color-text-secondary)' }}>
            {entry?.date}
          </span>
        </td>
        {/* Theatre */}
        <td className="px-3 py-3 hidden md:table-cell">
          <span className="text-sm truncate max-w-[140px] block" style={{ fontFamily: 'var(--font-body)', color: 'var(--color-text-secondary)' }}>
            {entry?.theatre}
          </span>
        </td>
        {/* Language */}
        <td className="px-3 py-3 hidden lg:table-cell">
          <span className="text-sm" style={{ fontFamily: 'var(--font-caption)', color: 'var(--color-text-secondary)' }}>
{entry?.language ? entry?.language?.charAt(0)?.toUpperCase() + entry?.language?.slice(1) : ''}
          </span>
        </td>
        {/* Companions */}
        <td className="px-3 py-3 hidden lg:table-cell">
          <span className="text-sm" style={{ fontFamily: 'var(--font-caption)', color: 'var(--color-text-secondary)' }}>
            {entry?.companions || '—'}
          </span>
        </td>
        {/* Total Cost */}
        <td className="px-3 py-3 whitespace-nowrap">
          <span className="text-sm font-semibold" style={{ fontFamily: 'var(--font-data)', color: 'var(--color-primary)' }}>
            {formatCurrency(entry?.totalCost)}
          </span>
        </td>
        {/* Actions */}
        <td className="px-3 py-3 w-28" onClick={(e) => e?.stopPropagation()}>
          <div className="flex items-center gap-1">
            <button
              onClick={() => onEdit(entry)}
              className="w-7 h-7 flex items-center justify-center rounded transition-colors duration-150"
              style={{ color: 'var(--color-text-secondary)' }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--color-surface-3)'; e.currentTarget.style.color = 'var(--color-primary)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--color-text-secondary)'; }}
              aria-label={`Edit ${entry?.movieName}`}
              title="Edit"
            >
              <Icon name="Pencil" size={14} strokeWidth={2} />
            </button>
            <button
              onClick={() => onDuplicate(entry)}
              className="w-7 h-7 flex items-center justify-center rounded transition-colors duration-150"
              style={{ color: 'var(--color-text-secondary)' }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--color-surface-3)'; e.currentTarget.style.color = 'var(--color-success)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--color-text-secondary)'; }}
              aria-label={`Duplicate ${entry?.movieName}`}
              title="Duplicate"
            >
              <Icon name="Copy" size={14} strokeWidth={2} />
            </button>
            <button
              onClick={() => onDelete(entry)}
              className="w-7 h-7 flex items-center justify-center rounded transition-colors duration-150"
              style={{ color: 'var(--color-text-secondary)' }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,142,142,0.1)'; e.currentTarget.style.color = 'var(--color-destructive)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--color-text-secondary)'; }}
              aria-label={`Delete ${entry?.movieName}`}
              title="Delete"
            >
              <Icon name="Trash2" size={14} strokeWidth={2} />
            </button>
            <button
              className="w-7 h-7 flex items-center justify-center rounded transition-all duration-150"
              style={{ color: 'var(--color-text-secondary)' }}
              aria-label={isExpanded ? 'Collapse details' : 'Expand details'}
              title={isExpanded ? 'Collapse' : 'Expand'}
            >
              <Icon name={isExpanded ? 'ChevronUp' : 'ChevronDown'} size={14} strokeWidth={2} />
            </button>
          </div>
        </td>
      </tr>
      {/* Expanded Detail Row */}
      {isExpanded && (
        <tr style={{ background: 'var(--color-surface-0)', borderBottom: '1px solid var(--color-border)' }}>
          <td colSpan={8} className="px-4 py-4">
            {children}
          </td>
        </tr>
      )}
    </>
  );
};

export default MovieTableRow;
