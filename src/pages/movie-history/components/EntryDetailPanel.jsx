import React from 'react';
import Icon from 'components/AppIcon';
import CostBreakdown from './CostBreakdown';

const Badge = ({ children, color = 'primary' }) => {
  const colorMap = {
    primary: { bg: 'rgba(212,175,55,0.15)', border: 'rgba(212,175,55,0.3)', text: 'var(--color-primary)' },
    success: { bg: 'rgba(78,205,196,0.15)', border: 'rgba(78,205,196,0.3)', text: 'var(--color-success)' },
    accent: { bg: 'rgba(255,107,107,0.15)', border: 'rgba(255,107,107,0.3)', text: 'var(--color-accent)' },
    muted: { bg: 'var(--color-surface-2)', border: 'var(--color-border)', text: 'var(--color-text-secondary)' },
  };
  const c = colorMap?.[color] || colorMap?.muted;
  return (
    <span
      className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium"
      style={{ background: c?.bg, border: `1px solid ${c?.border}`, color: c?.text, fontFamily: 'var(--font-caption)' }}
    >
      {children}
    </span>
  );
};

const InfoRow = ({ label, value, icon }) => (
  <div className="flex items-start gap-2">
    {icon && <Icon name={icon} size={14} color="var(--color-text-secondary)" strokeWidth={2} className="mt-0.5 flex-shrink-0" />}
    <div className="min-w-0">
      <p className="text-xs" style={{ fontFamily: 'var(--font-caption)', color: 'var(--color-text-secondary)' }}>{label}</p>
      <p className="text-sm font-medium truncate" style={{ fontFamily: 'var(--font-body)', color: 'var(--color-text-primary)' }}>{value || '—'}</p>
    </div>
  </div>
);

const EntryDetailPanel = ({ entry, onClose }) => {
  if (!entry) return null;

  return (
    <div
      className="rounded-lg p-4 lg:p-5 space-y-5"
      style={{ background: 'var(--color-surface-2)', border: '1px solid var(--color-border)' }}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text-primary)' }}>
            {entry?.movieName}
          </h3>
          <p className="text-xs mt-0.5" style={{ fontFamily: 'var(--font-caption)', color: 'var(--color-text-secondary)' }}>
            Full Entry Details
          </p>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {entry?.is3D && <Badge color="primary">3D</Badge>}
          {entry?.openingDay && entry?.openingShow && <Badge color="accent">FDFS</Badge>}
          {entry?.openingDay && !entry?.openingShow && <Badge color="success">Opening Day</Badge>}
        </div>
      </div>
      {/* Movie & Show Info */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ fontFamily: 'var(--font-caption)', color: 'var(--color-text-secondary)' }}>
          Show Information
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          <InfoRow label="Date" value={entry?.date} icon="Calendar" />
          <InfoRow label="Show Time" value={entry?.showTime} icon="Clock" />
          <InfoRow label="Theatre" value={entry?.theatre} icon="MapPin" />
          <InfoRow label="Location" value={[entry?.city, entry?.state, entry?.country]?.filter(Boolean)?.join(', ')} icon="Map" />
          <InfoRow label="Screen" value={entry?.screen} icon="Monitor" />
          <InfoRow label="Language" value={entry?.language ? entry?.language?.charAt(0)?.toUpperCase() + entry?.language?.slice(1) : ''} icon="Globe" />
          <InfoRow label="Seat No." value={entry?.seatNo} icon="Armchair" />
          <InfoRow label="Tickets" value={entry?.tickets} icon="Ticket" />
          <InfoRow label="Companions" value={entry?.companions} icon="Users" />
          <InfoRow label="Payment" value={entry?.paymentMode} icon="CreditCard" />
          {entry?.popcornSize && <InfoRow label="Popcorn Size" value={entry?.popcornSize} icon="ShoppingBag" />}
        </div>
      </div>
      {/* Cost Breakdown */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ fontFamily: 'var(--font-caption)', color: 'var(--color-text-secondary)' }}>
          Cost Breakdown
        </p>
        <CostBreakdown entry={entry} />
      </div>
    </div>
  );
};

export default EntryDetailPanel;
