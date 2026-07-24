import React from 'react';
import Button from 'components/ui/Button';
import Icon from 'components/AppIcon';

const FormActions = ({ onSave, onCancel, isSaving, hasUnsavedChanges, totalCost }) => {
  return (
    <div
      className="sticky bottom-0 left-0 right-0 z-[110] px-4 md:px-6 lg:px-8 py-4"
      style={{
        background: 'var(--color-card)',
        borderTop: '1px solid var(--color-border)',
        boxShadow: '0 -4px 16px rgba(26, 22, 37, 0.4)',
      }}
    >
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          {hasUnsavedChanges && (
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
              <span
                className="text-xs"
                style={{ fontFamily: 'var(--font-caption)', color: 'var(--color-warning)' }}
              >
                Unsaved changes
              </span>
            </div>
          )}
          {totalCost > 0 && (
            <div
              className="flex items-center gap-2 px-3 py-1.5 rounded-md"
              style={{ background: 'rgba(212, 175, 55, 0.1)', border: '1px solid rgba(212, 175, 55, 0.2)' }}
            >
              <Icon name="DollarSign" size={14} color="var(--color-primary)" strokeWidth={2} />
              <span
                className="text-sm font-semibold"
                style={{ fontFamily: 'var(--font-data)', color: 'var(--color-primary)' }}
              >
                Total: ${totalCost?.toFixed(2)}
              </span>
            </div>
          )}
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Button
            variant="ghost"
            size="default"
            onClick={onCancel}
            disabled={isSaving}
            className="flex-1 sm:flex-none"
          >
            Cancel
          </Button>
          <Button
            variant="default"
            size="default"
            onClick={onSave}
            loading={isSaving}
            iconName="Save"
            iconPosition="left"
            iconSize={16}
            className="flex-1 sm:flex-none"
          >
            Save Entry
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FormActions;