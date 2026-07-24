import React from 'react';
import Icon from 'components/AppIcon';
import Button from 'components/ui/Button';

const BulkActionBar = ({ selectedCount, totalCount, onSelectAll, onDeselectAll, onBulkExport, onBulkDelete }) => {
  if (selectedCount === 0) return null;

  return (
    <div
      className="flex flex-wrap items-center gap-3 px-4 lg:px-5 py-2.5"
      style={{ background: 'rgba(212,175,55,0.08)', borderBottom: '1px solid rgba(212,175,55,0.2)' }}
    >
      <div className="flex items-center gap-2">
        <Icon name="CheckSquare" size={15} color="var(--color-primary)" strokeWidth={2} />
        <span className="text-xs font-medium" style={{ fontFamily: 'var(--font-caption)', color: 'var(--color-primary)' }}>
          {selectedCount} of {totalCount} selected
        </span>
      </div>
      <div className="flex items-center gap-2 ml-auto">
        {selectedCount < totalCount ? (
          <Button variant="ghost" size="xs" onClick={onSelectAll}>Select All</Button>
        ) : (
          <Button variant="ghost" size="xs" onClick={onDeselectAll}>Deselect All</Button>
        )}
        <Button variant="outline" size="xs" iconName="Download" iconPosition="left" iconSize={13} onClick={onBulkExport}>
          Export Selected
        </Button>
        <Button variant="destructive" size="xs" iconName="Trash2" iconPosition="left" iconSize={13} onClick={onBulkDelete}>
          Delete Selected
        </Button>
      </div>
    </div>
  );
};

export default BulkActionBar;