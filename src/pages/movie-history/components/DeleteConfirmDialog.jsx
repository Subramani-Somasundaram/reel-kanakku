import React from 'react';
import Icon from 'components/AppIcon';
import Button from 'components/ui/Button';

const DeleteConfirmDialog = ({ isOpen, movieName, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(26,22,37,0.85)' }}>
      <div
        className="w-full max-w-sm rounded-xl p-6 space-y-4"
        style={{ background: 'var(--color-card)', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-2xl)' }}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(255,142,142,0.15)', border: '1px solid rgba(255,142,142,0.3)' }}>
            <Icon name="Trash2" size={18} color="var(--color-destructive)" strokeWidth={2} />
          </div>
          <div>
            <h3 className="text-base font-semibold" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text-primary)' }}>
              Delete Entry
            </h3>
            <p className="text-xs mt-0.5" style={{ fontFamily: 'var(--font-caption)', color: 'var(--color-text-secondary)' }}>
              This action cannot be undone
            </p>
          </div>
        </div>
        <p className="text-sm" style={{ fontFamily: 'var(--font-body)', color: 'var(--color-text-secondary)' }}>
          Are you sure you want to delete the entry for{' '}
          <span className="font-semibold" style={{ color: 'var(--color-text-primary)' }}>"{movieName}"</span>?
        </p>
        <div className="flex gap-3 pt-1">
          <Button variant="outline" fullWidth onClick={onCancel}>Cancel</Button>
          <Button variant="destructive" fullWidth onClick={onConfirm} iconName="Trash2" iconPosition="left" iconSize={15}>
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmDialog;