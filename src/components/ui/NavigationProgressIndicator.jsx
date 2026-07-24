import React from 'react';
import Icon from 'components/AppIcon';

const FORM_SECTIONS = [
  { id: 'basic', label: 'Basic Info', icon: 'Info' },
  { id: 'details', label: 'Movie Details', icon: 'Film' },
  { id: 'cost', label: 'Cost & Venue', icon: 'DollarSign' },
];

const NavigationProgressIndicator = ({ completedSections = [], activeSection = 'basic' }) => {
  const getStepStatus = (sectionId) => {
    if (completedSections?.includes(sectionId)) return 'completed';
    if (sectionId === activeSection) return 'active';
    return 'pending';
  };

  const completedCount = completedSections?.length;
  const progressPercent = Math.round((completedCount / FORM_SECTIONS?.length) * 100);

  return (
    <div className="w-full">
      {/* Desktop: Horizontal progress bar with steps */}
      <div className="hidden md:block">
        <div className="flex items-center justify-between mb-3">
          <span
            className="text-xs font-medium"
            style={{ fontFamily: 'var(--font-caption)', color: 'var(--color-text-secondary)' }}
          >
            Form Progress
          </span>
          <span
            className="text-xs font-medium"
            style={{ fontFamily: 'var(--font-data)', color: 'var(--color-primary)' }}
          >
            {completedCount}/{FORM_SECTIONS?.length} sections
          </span>
        </div>

        {/* Progress bar */}
        <div
          className="w-full h-1.5 rounded-full mb-4 overflow-hidden"
          style={{ background: 'var(--color-surface-2)' }}
          role="progressbar"
          aria-valuenow={progressPercent}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`Form completion: ${progressPercent}%`}
        >
          <div
            className="h-full rounded-full transition-all duration-250"
            style={{
              width: `${progressPercent}%`,
              background: 'linear-gradient(90deg, var(--color-primary), var(--color-accent))',
              boxShadow: progressPercent > 0 ? 'var(--shadow-golden)' : 'none',
              transitionTimingFunction: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            }}
          />
        </div>

        {/* Step indicators */}
        <div className="flex items-center gap-2">
          {FORM_SECTIONS?.map((section, index) => {
            const status = getStepStatus(section?.id);
            return (
              <React.Fragment key={section?.id}>
                <div className={`progress-step ${status}`}>
                  <div
                    className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{
                      background:
                        status === 'completed'
                          ? 'rgba(78, 205, 196, 0.15)'
                          : status === 'active' ?'rgba(212, 175, 55, 0.15)' :'var(--color-surface-2)',
                      border:
                        status === 'completed'
                          ? '1px solid var(--color-success)'
                          : status === 'active' ?'1px solid var(--color-primary)' :'1px solid var(--color-border)',
                    }}
                  >
                    {status === 'completed' ? (
                      <Icon name="Check" size={11} color="var(--color-success)" strokeWidth={2.5} />
                    ) : (
                      <span
                        style={{
                          fontFamily: 'var(--font-data)',
                          fontSize: '0.625rem',
                          fontWeight: 600,
                          color:
                            status === 'active' ?'var(--color-primary)' :'var(--color-text-secondary)',
                        }}
                      >
                        {index + 1}
                      </span>
                    )}
                  </div>
                  <span className="text-xs font-medium hidden lg:block">{section?.label}</span>
                </div>
                {index < FORM_SECTIONS?.length - 1 && (
                  <div
                    className="flex-1 h-px"
                    style={{
                      background:
                        completedSections?.includes(section?.id)
                          ? 'var(--color-success)'
                          : 'var(--color-border)',
                      opacity: 0.5,
                    }}
                  />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
      {/* Mobile: Vertical step indicator */}
      <div className="md:hidden">
        <div className="flex items-center justify-between mb-3">
          <span
            className="text-xs font-medium"
            style={{ fontFamily: 'var(--font-caption)', color: 'var(--color-text-secondary)' }}
          >
            {completedCount}/{FORM_SECTIONS?.length} completed
          </span>
          <span
            className="text-xs font-medium"
            style={{ fontFamily: 'var(--font-data)', color: 'var(--color-primary)' }}
          >
            {progressPercent}%
          </span>
        </div>
        <div
          className="w-full h-1 rounded-full overflow-hidden"
          style={{ background: 'var(--color-surface-2)' }}
          role="progressbar"
          aria-valuenow={progressPercent}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div
            className="h-full rounded-full transition-all duration-250"
            style={{
              width: `${progressPercent}%`,
              background: 'linear-gradient(90deg, var(--color-primary), var(--color-accent))',
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default NavigationProgressIndicator;