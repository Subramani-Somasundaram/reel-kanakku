import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from 'contexts/AuthContext';
import Icon from 'components/AppIcon';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: 'var(--color-background)' }}
      >
        <div className="flex flex-col items-center gap-3">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center"
            style={{ background: 'var(--color-primary-alpha)' }}
          >
            <img
              src="/assets/images/reel_kanakku_icon_1024-1773074709715.png"
              alt="Reel Kanakku Logo"
              style={{ width: 28, height: 28, objectFit: 'contain' }}
            />
          </div>
          <div className="flex items-center gap-2" style={{ color: 'var(--color-text-secondary)' }}>
            <Icon name="Loader2" size={16} className="animate-spin" />
            <span className="text-sm" style={{ fontFamily: 'var(--font-caption)' }}>Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
