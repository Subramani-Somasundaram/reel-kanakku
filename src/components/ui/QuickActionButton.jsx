import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Icon from 'components/AppIcon';

// Only visible on Dashboard and History screens
const VISIBLE_ROUTES = ['/dashboard', '/movie-history'];

const QuickActionButton = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  const isVisible = VISIBLE_ROUTES?.includes(location?.pathname);

  if (!isVisible) return null;

  const handleClick = () => {
    navigate('/add-movie-entry');
  };

  return (
    <button
      className="fab"
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onTouchStart={() => setIsPressed(true)}
      onTouchEnd={() => setIsPressed(false)}
      aria-label="Add new movie entry"
      title="Add new movie entry"
      style={{
        transform: isPressed
          ? 'scale(0.97)'
          : isHovered
          ? 'translateY(-3px) scale(1.05)'
          : 'translateY(0) scale(1)',
        boxShadow: isHovered
          ? '0 12px 24px rgba(26, 22, 37, 0.4), 0 4px 12px rgba(212, 175, 55, 0.15), 0 0 20px rgba(212, 175, 55, 0.4)'
          : 'var(--shadow-xl), var(--shadow-golden)',
      }}
    >
      <Icon name="Plus" size={24} color="var(--color-primary-foreground)" strokeWidth={2.5} />

      {/* Tooltip */}
      {isHovered && (
        <span
          className="absolute right-full mr-3 whitespace-nowrap px-3 py-1.5 rounded-md text-xs font-medium pointer-events-none"
          style={{
            background: 'var(--color-surface-2)',
            color: 'var(--color-text-primary)',
            fontFamily: 'var(--font-caption)',
            border: '1px solid var(--color-border)',
            boxShadow: 'var(--shadow-md)',
          }}
          role="tooltip"
        >
          Add Movie Entry
        </span>
      )}
    </button>
  );
};

export default QuickActionButton;