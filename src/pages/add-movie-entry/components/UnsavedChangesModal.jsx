import React from 'react';
import Button from 'components/ui/Button';
import Icon from 'components/AppIcon';

const UnsavedChangesModal = ({ isOpen, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[300] flex items-center justify-center p-4"
      style={{ background: 'rgba(26, 22, 37, 0.85)' }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="unsaved-modal-title"
    >
      <div
        className="w-full max-w-sm rounded-xl p-6"
        style={{
          background: 'var(--color-card)',
          border: '1px solid var(--color-border)',
          boxShadow: 'var(--shadow-2xl)',
        }}
      >
        <div className="flex items-center gap-3 mb-4">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
            style={{ background: 'rgba(255, 142, 142, 0.15)', border: '1px solid rgba(255, 142, 142, 0.3)' }}
          >
            <Icon name="AlertTriangle" size={20} color="var(--color-error)" strokeWidth={2} />
          </div>
          <div>
            <h3
              id="unsaved-modal-title"
              className="text-base font-semibold"
              style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text-primary)' }}
            >
              Unsaved Changes
            </h3>
            <p className="text-xs mt-0.5" style={{ fontFamily: 'var(--font-caption)', color: 'var(--color-text-secondary)' }}>
              You have unsaved changes that will be lost.
            </p>
          </div>
        </div>
        <p
          className="text-sm mb-6"
          style={{ fontFamily: 'var(--font-body)', color: 'var(--color-text-secondary)', maxWidth: 'none' }}
        >
          Are you sure you want to leave this page? All entered data will be discarded.
        </p>
        <div className="flex gap-3">
          <Button variant="ghost" size="sm" onClick={onCancel} className="flex-1">
            Keep Editing
          </Button>
          <Button variant="destructive" size="sm" onClick={onConfirm} className="flex-1">
            Discard Changes
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UnsavedChangesModal;