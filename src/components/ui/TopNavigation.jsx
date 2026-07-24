import React, { useState, useEffect } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import Icon from 'components/AppIcon';
import { useAuth } from 'contexts/AuthContext';
import { useTheme } from 'contexts/ThemeContext';

const NAV_ITEMS = [
{ label: 'Dashboard', path: '/dashboard', icon: 'LayoutDashboard' },
{ label: 'Add Entry', path: '/add-movie-entry', icon: 'PlusCircle' },
{ label: 'History', path: '/movie-history', icon: 'Film' },
{ label: 'Analytics', path: '/analytics', icon: 'BarChart2' },
{ label: 'Settings', path: '/settings', icon: 'Settings' },
{ label: 'Profile', path: '/profile', icon: 'UserCircle' }];


const TopNavigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut, user } = useAuth();
  const { theme, toggleTheme, isLight } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSignOut = async () => {
    setSigningOut(true);
    await signOut();
    setSigningOut(false);
    navigate('/login', { replace: true });
  };

  return (
    <>
      {/* Desktop Header */}
      <header
        className={`nav-header transition-all duration-250 ${
        scrolled ? 'shadow-xl' : 'shadow-md'}`
        }
        role="banner">

        {/* Logo */}
        <NavLink to="/dashboard" className="nav-logo-container mr-8" aria-label="CineTrack Home">
          <div className="nav-logo">
            <img
              src="/assets/images/reel_kanakku_icon_1024-1773074709715.png"
              alt="Reel Kanakku logo"
              style={{ width: 28, height: 28, objectFit: 'contain' }}
            />
          </div>
          <span className="nav-logo-text hidden sm:block">Reel Kanakku</span>
        </NavLink>

        {/* Desktop Nav Links */}
        <nav
          className="hidden md:flex items-center gap-1 flex-1"
          aria-label="Primary navigation">

          {NAV_ITEMS?.map((item) =>
          <NavLink
            key={item?.path}
            to={item?.path}
            className={({ isActive }) =>
            `nav-link ${isActive ? 'active' : ''}`
            }
            aria-current={location?.pathname === item?.path ? 'page' : undefined}>

              <Icon name={item?.icon} size={17} strokeWidth={2} />
              {item?.label}
            </NavLink>
          )}
        </nav>

        {/* Right side actions */}
        <div className="ml-auto flex items-center gap-3">
          <span
            className="font-caption text-xs text-muted-foreground hidden lg:block"
            style={{ fontFamily: 'var(--font-data)' }}>

            {new Date()?.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </span>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="flex items-center justify-center w-9 h-9 rounded-lg transition-all"
            style={{
              background: 'var(--color-surface-2)',
              border: '1px solid var(--color-border)',
              color: 'var(--color-text-secondary)',
              cursor: 'pointer',
            }}
            aria-label={isLight ? 'Switch to dark mode' : 'Switch to light mode'}
            title={isLight ? 'Switch to dark mode' : 'Switch to light mode'}
          >
            <Icon name={isLight ? 'Moon' : 'Sun'} size={16} strokeWidth={2} />
          </button>

          {user && (
            <button
              onClick={handleSignOut}
              disabled={signingOut}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
              style={{
                background: 'var(--color-surface-2)',
                border: '1px solid var(--color-border)',
                color: 'var(--color-text-secondary)',
                fontFamily: 'var(--font-caption)',
                cursor: signingOut ? 'not-allowed' : 'pointer'
              }}
              aria-label="Sign out"
            >
              {signingOut ? (
                <Icon name="Loader2" size={14} className="animate-spin" />
              ) : (
                <Icon name="LogOut" size={14} />
              )}
              <span className="hidden sm:inline">{signingOut ? 'Signing out...' : 'Sign Out'}</span>
            </button>
          )}
        </div>
      </header>
      {/* Mobile Bottom Tab Bar */}
      <nav
        className="bottom-nav md:hidden"
        aria-label="Mobile navigation"
        role="navigation">

        {NAV_ITEMS?.map((item) =>
        <NavLink
          key={item?.path}
          to={item?.path}
          className={({ isActive }) =>
          `bottom-nav-item ${isActive ? 'active' : ''}`
          }
          aria-current={location?.pathname === item?.path ? 'page' : undefined}
          aria-label={item?.label}>

            <Icon name={item?.icon} size={20} strokeWidth={2} />
            <span className="bottom-nav-label">{item?.label}</span>
          </NavLink>
        )}
      </nav>
    </>
  );
};

export default TopNavigation;