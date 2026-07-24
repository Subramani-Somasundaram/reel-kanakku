import React, { useEffect } from 'react';
import Icon from 'components/AppIcon';

const SuccessToast = ({ isVisible, movieName, totalCost, onClose }) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(onClose, 4000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  return (
    <div
      className="fixed top-20 right-4 z-[400] max-w-sm w-full mx-4 rounded-xl p-4 stagger-reveal"
      style={{
        background: 'var(--color-card)',
        border: '1px solid rgba(78, 205, 196, 0.4)',
        boxShadow: '0 8px 24px rgba(26, 22, 37, 0.5), 0 0 12px rgba(78, 205, 196, 0.2)',
      }}
    >
      <div className="flex items-start gap-3">
        <div
          className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
          style={{ background: 'rgba(78, 205, 196, 0.15)', border: '1px solid rgba(78, 205, 196, 0.3)' }}
        >
          <Icon name="CheckCircle" size={18} color="var(--color-success)" strokeWidth={2} />
        </div>
        <div className="flex-1 min-w-0">
          <p
            className="text-sm font-semibold"
            style={{ fontFamily: 'var(--font-caption)', color: 'var(--color-success)' }}
          >
            Entry Saved Successfully!
          </p>
          <p
            className="text-xs mt-0.5 truncate"
            style={{ fontFamily: 'var(--font-caption)', color: 'var(--color-text-secondary)' }}
          >
            {movieName} — ${totalCost?.toFixed(2)} total
          </p>
        </div>
        <button
          onClick={onClose}
          className="w-6 h-6 flex items-center justify-center rounded flex-shrink-0"
          style={{ color: 'var(--color-text-secondary)' }}
          aria-label="Close notification"
        >
          <Icon name="X" size={14} strokeWidth={2} />
        </button>
      </div>
    </div>
  );
};

export default SuccessToast;