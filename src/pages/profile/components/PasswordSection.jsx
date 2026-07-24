import React, { useState } from 'react';
import { supabase } from '../../../lib/supabase';
import Icon from 'components/AppIcon';

const PasswordSection = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const showFeedback = (type, message) => {
    setFeedback({ type, message });
    setTimeout(() => setFeedback(null), 4000);
  };

  const getStrength = (pwd) => {
    if (!pwd) return { level: 0, label: '', color: '' };
    let score = 0;
    if (pwd?.length >= 8) score++;
    if (/[A-Z]/?.test(pwd)) score++;
    if (/[0-9]/?.test(pwd)) score++;
    if (/[^A-Za-z0-9]/?.test(pwd)) score++;
    const levels = [
      { level: 0, label: '', color: '' },
      { level: 1, label: 'Weak', color: '#ef4444' },
      { level: 2, label: 'Fair', color: '#f97316' },
      { level: 3, label: 'Good', color: '#eab308' },
      { level: 4, label: 'Strong', color: '#22c55e' }
    ];
    return levels?.[score] || levels?.[0];
  };

  const strength = getStrength(newPassword);

  const handleUpdate = async (e) => {
    e?.preventDefault();
    if (!currentPassword) {
      showFeedback('error', 'Please enter your current password.');
      return;
    }
    if (!newPassword || newPassword?.length < 6) {
      showFeedback('error', 'New password must be at least 6 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      showFeedback('error', 'New passwords do not match.');
      return;
    }
    setLoading(true);
    try {
      // Re-authenticate first
      const { data: { user } } = await supabase?.auth?.getUser();
      const { error: signInError } = await supabase?.auth?.signInWithPassword({
        email: user?.email,
        password: currentPassword
      });
      if (signInError) {
        showFeedback('error', 'Current password is incorrect.');
        setLoading(false);
        return;
      }
      const { error } = await supabase?.auth?.updateUser({ password: newPassword });
      if (error) {
        showFeedback('error', error?.message || 'Failed to update password.');
      } else {
        showFeedback('success', 'Password updated successfully.');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      }
    } catch (err) {
      showFeedback('error', 'Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    background: 'var(--color-surface-2)',
    border: '1px solid var(--color-border)',
    color: 'var(--color-text-primary)',
    fontFamily: 'var(--font-body)'
  };

  const PasswordField = ({ label, value, onChange, show, onToggle, placeholder, autoComplete }) => (
    <div>
      <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--color-text-secondary)', fontFamily: 'var(--font-caption)' }}>
        {label}
      </label>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2">
          <Icon name="Lock" size={16} color="var(--color-text-secondary)" />
        </span>
        <input
          type={show ? 'text' : 'password'}
          value={value}
          onChange={(e) => onChange(e?.target?.value)}
          placeholder={placeholder}
          autoComplete={autoComplete}
          className="w-full pl-9 pr-10 py-2.5 rounded-lg text-sm outline-none transition-all"
          style={inputStyle}
        />
        <button type="button" onClick={onToggle} className="absolute right-3 top-1/2 -translate-y-1/2" tabIndex={-1}>
          <Icon name={show ? 'EyeOff' : 'Eye'} size={16} color="var(--color-text-secondary)" />
        </button>
      </div>
    </div>
  );

  return (
    <section
      className="rounded-xl p-5 md:p-6"
      style={{ background: 'var(--color-card)', border: '1px solid var(--color-border)' }}
    >
      <div className="flex items-center gap-3 mb-5">
        <div
          className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.4)' }}
        >
          <Icon name="KeyRound" size={18} color="#6366f1" strokeWidth={1.5} />
        </div>
        <div>
          <h2 className="text-base font-semibold" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text-primary)' }}>
            Password Management
          </h2>
          <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>Change your account password securely</p>
        </div>
      </div>
      <form onSubmit={handleUpdate} className="space-y-4">
        <PasswordField
          label="Current Password"
          value={currentPassword}
          onChange={setCurrentPassword}
          show={showCurrent}
          onToggle={() => setShowCurrent(v => !v)}
          placeholder="Enter current password"
          autoComplete="current-password"
        />

        <PasswordField
          label="New Password"
          value={newPassword}
          onChange={setNewPassword}
          show={showNew}
          onToggle={() => setShowNew(v => !v)}
          placeholder="Enter new password"
          autoComplete="new-password"
        />

        {/* Strength indicator */}
        {newPassword && (
          <div className="space-y-1.5">
            <div className="flex gap-1">
              {[1, 2, 3, 4]?.map((i) => (
                <div
                  key={i}
                  className="h-1 flex-1 rounded-full transition-all"
                  style={{
                    background: i <= strength?.level ? strength?.color : 'var(--color-border)'
                  }}
                />
              ))}
            </div>
            {strength?.label && (
              <p className="text-xs" style={{ color: strength?.color, fontFamily: 'var(--font-caption)' }}>
                {strength?.label} password
              </p>
            )}
          </div>
        )}

        <PasswordField
          label="Confirm New Password"
          value={confirmPassword}
          onChange={setConfirmPassword}
          show={showConfirm}
          onToggle={() => setShowConfirm(v => !v)}
          placeholder="Confirm new password"
          autoComplete="new-password"
        />

        {/* Feedback */}
        {feedback && (
          <div
            className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm"
            style={{
              background: feedback?.type === 'success' ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)',
              border: `1px solid ${feedback?.type === 'success' ? 'rgba(34,197,94,0.3)' : 'rgba(239,68,68,0.3)'}`,
              color: feedback?.type === 'success' ? '#22c55e' : '#ef4444'
            }}
          >
            <Icon name={feedback?.type === 'success' ? 'CheckCircle' : 'AlertCircle'} size={15} />
            <span>{feedback?.message}</span>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all"
          style={{
            background: loading ? 'var(--color-surface-2)' : '#6366f1',
            color: loading ? 'var(--color-text-secondary)' : '#fff',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontFamily: 'var(--font-caption)'
          }}
        >
          {loading ? <Icon name="Loader2" size={15} className="animate-spin" /> : <Icon name="ShieldCheck" size={15} />}
          {loading ? 'Updating...' : 'Update Password'}
        </button>
      </form>
    </section>
  );
};

export default PasswordSection;
