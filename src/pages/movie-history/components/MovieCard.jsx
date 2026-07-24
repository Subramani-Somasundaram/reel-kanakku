import React, { useState } from 'react';
import Icon from 'components/AppIcon';
import EntryDetailPanel from './EntryDetailPanel';
import { useCurrency } from 'context/CurrencyContext';
import { useMoviePoster } from 'utils/useMoviePoster';

const ellipsisText = {
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
};

const MovieCard = ({ entry, isSelected, onSelect, onEdit, onDuplicate, onDelete }) => {
  const omdbPoster = useMoviePoster(entry?.posterUrl ? null : (entry?.movieName || entry?.movie_name));
  const poster = entry?.posterUrl || omdbPoster;
  const [expanded, setExpanded] = useState(false);
  const { formatCurrency } = useCurrency();

  return (
    <div
      className="rounded-lg overflow-hidden transition-all duration-200 flex flex-col"
      style={{
        background: 'var(--color-card)',
        border: `1px solid ${isSelected ? 'var(--color-primary)' : 'var(--color-border)'}`,
        boxShadow: isSelected ? 'var(--shadow-golden)' : 'var(--shadow-sm)',
        minHeight: 200,
        maxHeight: 280,
        overflow: 'hidden',
      }}
    >
      {/* Card Header */}
      <div className="p-4 flex-1 min-h-0 overflow-hidden">
        <div className="flex items-start gap-3 h-full min-h-0">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={() => onSelect(entry?.id)}
            className="w-4 h-4 rounded flex-shrink-0 cursor-pointer self-start"
            style={{ accentColor: 'var(--color-primary)', marginTop: poster ? 4 : 2 }}
            aria-label={`Select ${entry?.movieName}`}
          />
          {poster && (
            <img
              src={poster}
              alt={entry?.movieName}
              className="rounded-md flex-shrink-0"
              style={{
                width: 80,
                height: 120,
                objectFit: 'cover',
                background: 'var(--color-surface-2)',
              }}
              onError={(e) => { e.target.style.display = 'none'; }}
            />
          )}
          <div className="flex-1 min-w-0 flex flex-col min-h-0 overflow-hidden">
            <div className="flex items-start justify-between gap-2 min-w-0">
              <div className="min-w-0 flex-1 overflow-hidden">
                <h3
                  className="text-sm font-semibold leading-snug"
                  style={{
                    fontFamily: 'var(--font-heading)',
                    color: 'var(--color-text-primary)',
                    ...ellipsisText,
                  }}
                  title={entry?.movieName}
                >
                  {entry?.movieName}
                </h3>
                <p
                  className="text-xs mt-1"
                  style={{
                    fontFamily: 'var(--font-caption)',
                    color: 'var(--color-text-secondary)',
                    ...ellipsisText,
                  }}
                  title={`${entry?.date} · ${entry?.showTime}`}
                >
                  {entry?.date} &bull; {entry?.showTime}
                </p>
              </div>
              <span
                className="text-sm font-bold flex-shrink-0 leading-tight text-right max-w-[40%]"
                style={{
                  fontFamily: 'var(--font-data)',
                  color: 'var(--color-primary)',
                  ...ellipsisText,
                }}
                title={formatCurrency(entry?.totalCost)}
              >
                {formatCurrency(entry?.totalCost)}
              </span>
            </div>
            <div className="mt-2 space-y-1 min-w-0 overflow-hidden">
              <div className="flex items-center gap-1 min-w-0" style={{ color: 'var(--color-text-secondary)' }}>
                <Icon name="MapPin" size={11} strokeWidth={2} className="flex-shrink-0" />
                <span
                  className="text-xs min-w-0"
                  style={{ fontFamily: 'var(--font-caption)', ...ellipsisText }}
                  title={entry?.theatre}
                >
                  {entry?.theatre}
                </span>
              </div>
              {entry?.companions && (
                <div className="flex items-center gap-1 min-w-0" style={{ color: 'var(--color-text-secondary)' }}>
                  <Icon name="Users" size={11} strokeWidth={2} className="flex-shrink-0" />
                  <span
                    className="text-xs min-w-0"
                    style={{ fontFamily: 'var(--font-caption)', ...ellipsisText }}
                    title={entry?.companions}
                  >
                    {entry?.companions}
                  </span>
                </div>
              )}
              <span
                className="text-xs block"
                style={{
                  color: 'var(--color-text-secondary)',
                  fontFamily: 'var(--font-caption)',
                  ...ellipsisText,
                }}
                title={entry?.language}
              >
                {entry?.language ? entry?.language?.charAt(0)?.toUpperCase() + entry?.language?.slice(1) : ''}
              </span>
            </div>
            <div className="flex items-center gap-1.5 mt-2 flex-wrap overflow-hidden">
              {entry?.is3D && (
                <span className="text-xs px-1.5 py-0.5 rounded flex-shrink-0" style={{ background: 'rgba(212,175,55,0.15)', color: 'var(--color-primary)', fontFamily: 'var(--font-caption)' }}>3D</span>
              )}
              {entry?.openingDay && (
                <span className="text-xs px-1.5 py-0.5 rounded flex-shrink-0" style={{ background: 'rgba(255,107,107,0.15)', color: 'var(--color-accent)', fontFamily: 'var(--font-caption)' }}>Opening Day</span>
              )}
              {entry?.openingShow && (
                <span className="text-xs px-1.5 py-0.5 rounded flex-shrink-0" style={{ background: 'rgba(34,197,94,0.15)', color: 'var(--color-success)', fontFamily: 'var(--font-caption)' }}>Opening Show</span>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* Actions */}
      <div className="flex items-center justify-between px-4 py-2 flex-shrink-0" style={{ borderTop: '1px solid var(--color-border)', background: 'var(--color-surface-2)' }}>
        <div className="flex items-center gap-1 min-w-0 overflow-hidden">
          <button
            onClick={() => onEdit(entry)}
            className="flex items-center gap-1 px-2 py-1.5 rounded text-xs transition-colors duration-150 flex-shrink-0"
            style={{ color: 'var(--color-text-secondary)', fontFamily: 'var(--font-caption)' }}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--color-surface-3)'; e.currentTarget.style.color = 'var(--color-primary)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--color-text-secondary)'; }}
          >
            <Icon name="Pencil" size={13} strokeWidth={2} /> Edit
          </button>
          <button
            onClick={() => onDuplicate(entry)}
            className="flex items-center gap-1 px-2 py-1.5 rounded text-xs transition-colors duration-150 flex-shrink-0"
            style={{ color: 'var(--color-text-secondary)', fontFamily: 'var(--font-caption)' }}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--color-surface-3)'; e.currentTarget.style.color = 'var(--color-success)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--color-text-secondary)'; }}
          >
            <Icon name="Copy" size={13} strokeWidth={2} /> Duplicate
          </button>
          <button
            onClick={() => onDelete(entry)}
            className="flex items-center gap-1 px-2 py-1.5 rounded text-xs transition-colors duration-150 flex-shrink-0"
            style={{ color: 'var(--color-text-secondary)', fontFamily: 'var(--font-caption)' }}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,142,142,0.1)'; e.currentTarget.style.color = 'var(--color-destructive)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--color-text-secondary)'; }}
          >
            <Icon name="Trash2" size={13} strokeWidth={2} /> Delete
          </button>
        </div>
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-1 px-2 py-1.5 rounded text-xs transition-colors duration-150 flex-shrink-0"
          style={{ color: 'var(--color-primary)', fontFamily: 'var(--font-caption)' }}
        >
          {expanded ? 'Less' : 'Details'}
          <Icon name={expanded ? 'ChevronUp' : 'ChevronDown'} size={13} strokeWidth={2} />
        </button>
      </div>
      {/* Expanded Detail */}
      {expanded && (
        <div className="p-4 flex-shrink-0 overflow-y-auto" style={{ borderTop: '1px solid var(--color-border)', maxHeight: 120 }}>
          <EntryDetailPanel entry={entry} onClose={() => setExpanded(false)} />
        </div>
      )}
    </div>
  );
};

export default MovieCard;
