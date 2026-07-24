import React, { useState } from 'react';
import TopNavigation from 'components/ui/TopNavigation';
import QuickActionButton from 'components/ui/QuickActionButton';
import Icon from 'components/AppIcon';
import Button from 'components/ui/Button';
import { useCurrency } from 'context/CurrencyContext';
import { useTheme } from 'contexts/ThemeContext';
import CurrencySettings from './components/CurrencySettings';
import DisplayPreferences from './components/DisplayPreferences';

const Settings = () => {
  const { currencyCode, changeCurrency } = useCurrency();
  const { theme, toggleTheme, isLight } = useTheme();
  const [selectedCurrency, setSelectedCurrency] = useState(currencyCode);
  const [dateFormat, setDateFormat] = useState('MM/DD/YYYY');
  const [numberFormat, setNumberFormat] = useState('en');
  const [saved, setSaved] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const handleCurrencySelect = (code) => {
    setSelectedCurrency(code);
    setHasChanges(true);
    setSaved(false);
  };

  const handleDateFormatChange = (fmt) => {
    setDateFormat(fmt);
    setHasChanges(true);
    setSaved(false);
  };

  const handleNumberFormatChange = (fmt) => {
    setNumberFormat(fmt);
    setHasChanges(true);
    setSaved(false);
  };

  const handleSave = () => {
    changeCurrency(selectedCurrency);
    setSaved(true);
    setHasChanges(false);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleReset = () => {
    setSelectedCurrency('INR');
    setDateFormat('MM/DD/YYYY');
    setNumberFormat('en');
    setHasChanges(true);
    setSaved(false);
  };

  return (
    <div className="min-h-screen" style={{ background: 'var(--color-background)' }}>
      <TopNavigation />
      <main className="pt-16 pb-20 md:pb-8 px-4 md:px-6 lg:px-8 max-w-3xl mx-auto">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-5 md:py-7">
          <div>
            <h1
              className="text-2xl md:text-3xl font-bold"
              style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text-primary)' }}
            >
              Settings
            </h1>
            <p
              className="text-sm mt-1"
              style={{ color: 'var(--color-text-secondary)', fontFamily: 'var(--font-caption)' }}
            >
              Customize your Reel Kanakku experience
            </p>
          </div>
          {/* Save / Reset Actions */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              iconName="RotateCcw"
              iconPosition="left"
              iconSize={14}
              onClick={handleReset}
            >
              Reset
            </Button>
            <Button
              variant="default"
              size="sm"
              iconName={saved ? 'CheckCircle2' : 'Save'}
              iconPosition="left"
              iconSize={15}
              onClick={handleSave}
              disabled={!hasChanges}
            >
              {saved ? 'Saved!' : 'Save Changes'}
            </Button>
          </div>
        </div>

        {/* Success Banner */}
        {saved && (
          <div
            className="flex items-center gap-3 px-4 py-3 rounded-lg mb-5"
            style={{ background: 'rgba(78,205,196,0.12)', border: '1px solid rgba(78,205,196,0.3)' }}
          >
            <Icon name="CheckCircle2" size={16} color="var(--color-success)" strokeWidth={2} />
            <p className="text-sm" style={{ fontFamily: 'var(--font-caption)', color: 'var(--color-success)' }}>
              Settings saved successfully! Currency updated across the app.
            </p>
          </div>
        )}

        {/* Settings Sections */}
        <div className="space-y-5">

          {/* Appearance / Theme */}
          <div
            className="rounded-xl p-5 md:p-6"
            style={{ background: 'var(--color-card)', border: '1px solid var(--color-border)' }}
          >
            <div className="flex items-center gap-3 mb-5">
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ background: 'rgba(212,175,55,0.12)', border: '1px solid rgba(212,175,55,0.3)' }}
              >
                <Icon name={isLight ? 'Sun' : 'Moon'} size={18} color="var(--color-primary)" strokeWidth={1.8} />
              </div>
              <div>
                <h2 className="text-base font-semibold" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text-primary)' }}>
                  Appearance
                </h2>
                <p className="text-xs mt-0.5" style={{ fontFamily: 'var(--font-caption)', color: 'var(--color-text-secondary)' }}>
                  Choose between light and dark mode
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium" style={{ color: 'var(--color-text-primary)', fontFamily: 'var(--font-body)' }}>
                  {isLight ? 'Light Mode' : 'Dark Mode'}
                </p>
                <p className="text-xs mt-0.5" style={{ color: 'var(--color-text-secondary)', fontFamily: 'var(--font-caption)' }}>
                  {isLight ? 'Switch to dark for a cinema-style experience' : 'Switch to light for a brighter interface'}
                </p>
              </div>
              {/* Toggle Switch */}
              <button
                onClick={toggleTheme}
                className="relative flex-shrink-0 w-14 h-7 rounded-full transition-all duration-300 focus:outline-none"
                style={{
                  background: isLight ? 'var(--color-surface-2)' : 'var(--color-primary)',
                  border: '1px solid var(--color-border)',
                }}
                aria-label={isLight ? 'Switch to dark mode' : 'Switch to light mode'}
                role="switch"
                aria-checked={!isLight}
              >
                <span
                  className="absolute top-0.5 w-6 h-6 rounded-full flex items-center justify-center transition-all duration-300 shadow-sm"
                  style={{
                    left: isLight ? '2px' : 'calc(100% - 26px)',
                    background: isLight ? '#FFFFFF' : 'var(--color-primary-foreground)',
                  }}
                >
                  <Icon name={isLight ? 'Sun' : 'Moon'} size={13} color={isLight ? '#D97706' : '#1A1625'} strokeWidth={2} />
                </span>
              </button>
            </div>

            {/* Mode Cards */}
            <div className="grid grid-cols-2 gap-3 mt-4">
              <button
                onClick={() => theme !== 'dark' && toggleTheme()}
                className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg transition-all text-left"
                style={{
                  background: !isLight ? 'rgba(212,175,55,0.1)' : 'var(--color-surface-2)',
                  border: !isLight ? '1px solid rgba(212,175,55,0.4)' : '1px solid var(--color-border)',
                }}
              >
                <Icon name="Moon" size={16} color={!isLight ? 'var(--color-primary)' : 'var(--color-text-secondary)'} strokeWidth={2} />
                <div>
                  <p className="text-xs font-medium" style={{ color: !isLight ? 'var(--color-primary)' : 'var(--color-text-secondary)', fontFamily: 'var(--font-caption)' }}>Dark</p>
                  <p className="text-xs" style={{ color: 'var(--color-text-secondary)', fontFamily: 'var(--font-caption)' }}>Cinema style</p>
                </div>
                {!isLight && <Icon name="Check" size={13} color="var(--color-primary)" strokeWidth={2.5} className="ml-auto" />}
              </button>
              <button
                onClick={() => theme !== 'light' && toggleTheme()}
                className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg transition-all text-left"
                style={{
                  background: isLight ? 'rgba(212,175,55,0.1)' : 'var(--color-surface-2)',
                  border: isLight ? '1px solid rgba(212,175,55,0.4)' : '1px solid var(--color-border)',
                }}
              >
                <Icon name="Sun" size={16} color={isLight ? 'var(--color-primary)' : 'var(--color-text-secondary)'} strokeWidth={2} />
                <div>
                  <p className="text-xs font-medium" style={{ color: isLight ? 'var(--color-primary)' : 'var(--color-text-secondary)', fontFamily: 'var(--font-caption)' }}>Light</p>
                  <p className="text-xs" style={{ color: 'var(--color-text-secondary)', fontFamily: 'var(--font-caption)' }}>Bright & clear</p>
                </div>
                {isLight && <Icon name="Check" size={13} color="var(--color-primary)" strokeWidth={2.5} className="ml-auto" />}
              </button>
            </div>
          </div>

          <CurrencySettings selectedCode={selectedCurrency} onSelect={handleCurrencySelect} />
          <DisplayPreferences
            dateFormat={dateFormat}
            onDateFormatChange={handleDateFormatChange}
            numberFormat={numberFormat}
            onNumberFormatChange={handleNumberFormatChange}
          />

          {/* Data Management */}
          <div
            className="rounded-xl p-5 md:p-6"
            style={{ background: 'var(--color-card)', border: '1px solid var(--color-border)' }}
          >
            <div className="flex items-center gap-3 mb-5">
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ background: 'rgba(255,107,107,0.12)', border: '1px solid rgba(255,107,107,0.3)' }}
              >
                <Icon name="Database" size={18} color="var(--color-accent)" strokeWidth={1.8} />
              </div>
              <div>
                <h2 className="text-base font-semibold" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text-primary)' }}>
                  Data Management
                </h2>
                <p className="text-xs mt-0.5" style={{ fontFamily: 'var(--font-caption)', color: 'var(--color-text-secondary)' }}>
                  Export or backup your movie tracking data
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm" iconName="Download" iconPosition="left" iconSize={14}>
                Export as CSV
              </Button>
              <Button variant="outline" size="sm" iconName="FileJson" iconPosition="left" iconSize={14}>
                Export as JSON
              </Button>
            </div>
          </div>
        </div>

        {/* Bottom Save Bar */}
        {hasChanges && (
          <div
            className="fixed bottom-20 md:bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-3 px-5 py-3 rounded-xl shadow-xl z-50"
            style={{ background: 'var(--color-card)', border: '1px solid var(--color-primary)', boxShadow: '0 8px 32px rgba(212,175,55,0.25)' }}
          >
            <Icon name="AlertCircle" size={15} color="var(--color-primary)" strokeWidth={2} />
            <span className="text-sm" style={{ fontFamily: 'var(--font-caption)', color: 'var(--color-text-primary)' }}>
              You have unsaved changes
            </span>
            <Button variant="default" size="xs" onClick={handleSave}>
              Save Now
            </Button>
          </div>
        )}
      </main>
      <QuickActionButton />
    </div>
  );
};

export default Settings;
