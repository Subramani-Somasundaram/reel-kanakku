import React from 'react';
import Icon from 'components/AppIcon';

const SectionHeader = ({ title, subtitle, iconName, isOpen, onToggle, isCompleted }) => {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="w-full flex items-center justify-between p-4 md:p-5 text-left transition-all duration-250 rounded-lg"
      style={{
        background: isOpen ? 'rgba(212, 175, 55, 0.08)' : 'var(--color-surface-2)',
        border: `1px solid ${isOpen ? 'rgba(212, 175, 55, 0.3)' : 'var(--color-border)'}`,
      }}
      aria-expanded={isOpen}
    >
      <div className="flex items-center gap-3">
        <div
          className="w-9 h-9 rounded-md flex items-center justify-center flex-shrink-0"
          style={{
            background: isCompleted
              ? 'rgba(78, 205, 196, 0.15)'
              : isOpen
              ? 'rgba(212, 175, 55, 0.15)'
              : 'var(--color-surface-3)',
            border: `1px solid ${isCompleted ? 'var(--color-success)' : isOpen ? 'rgba(212, 175, 55, 0.4)' : 'var(--color-border)'}`,
          }}
        >
          {isCompleted ? (
            <Icon name="CheckCircle" size={18} color="var(--color-success)" strokeWidth={2} />
          ) : (
            <Icon name={iconName} size={18} color={isOpen ? 'var(--color-primary)' : 'var(--color-text-secondary)'} strokeWidth={1.5} />
          )}
        </div>
        <div>
          <h3
            className="text-sm md:text-base font-semibold"
            style={{
              fontFamily: 'var(--font-heading)',
              color: isOpen ? 'var(--color-primary)' : 'var(--color-text-primary)',
            }}
          >
            {title}
          </h3>
          {subtitle && (
            <p className="text-xs mt-0.5" style={{ fontFamily: 'var(--font-caption)', color: 'var(--color-text-secondary)' }}>
              {subtitle}
            </p>
          )}
        </div>
      </div>
      <Icon
        name={isOpen ? 'ChevronUp' : 'ChevronDown'}
        size={18}
        color="var(--color-text-secondary)"
        strokeWidth={2}
      />
    </button>
  );
};

export default SectionHeader;