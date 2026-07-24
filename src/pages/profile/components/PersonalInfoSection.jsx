import React, { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import { useAuth } from 'contexts/AuthContext';
import Icon from 'components/AppIcon';

const PersonalInfoSection = () => {
  const { user } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);

  useEffect(() => {
    if (user) {
      setName(user?.user_metadata?.full_name || '');
      setEmail(user?.email || '');
    }
  }, [user]);

  const showFeedback = (type, message) => {
    setFeedback({ type, message });
    setTimeout(() => setFeedback(null), 4000);
  };

  const handleSave = async (e) => {
    e?.preventDefault();
    if (!name?.trim()) {
      showFeedback('error', 'Display name cannot be empty.');
      return;
    }
    if (!email?.trim()) {
      showFeedback('error', 'Email cannot be empty.');
      return;
    }
    setLoading(true);
    try {
      const updates = { data: { full_name: name?.trim() } };
      if (email?.trim() !== user?.email) {
        updates.email = email?.trim();
      }
      const { error } = await supabase?.auth?.updateUser(updates);
      if (error) {
        showFeedback('error', error?.message || 'Failed to update profile.');
      } else {
        showFeedback('success', email?.trim() !== user?.email
          ? 'Profile updated. Check your new email for a confirmation link.' :'Profile updated successfully.');
      }
    } catch (err) {
      showFeedback('error', 'Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      className="rounded-xl p-5 md:p-6"
      style={{ background: 'var(--color-card)', border: '1px solid var(--color-border)' }}
    >
      <div className="flex items-center gap-3 mb-5">
        <div
          className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ background: 'var(--color-primary-alpha)', border: '1px solid var(--color-primary)' }}
        >
          <Icon name="User" size={18} color="var(--color-primary)" strokeWidth={1.5} />
        </div>
        <div>
          <h2 className="text-base font-semibold" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text-primary)' }}>
            Personal Information
          </h2>
          <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>Update your display name and email address</p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-4">
        {/* Display Name */}
        <div>
          <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--color-text-secondary)', fontFamily: 'var(--font-caption)' }}>
            Display Name
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2">
              <Icon name="UserCircle" size={16} color="var(--color-text-secondary)" />
            </span>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e?.target?.value)}
              placeholder="Your display name"
              className="w-full pl-9 pr-4 py-2.5 rounded-lg text-sm outline-none transition-all"
              style={{
                background: 'var(--color-surface-2)',
                border: '1px solid var(--color-border)',
                color: 'var(--color-text-primary)',
                fontFamily: 'var(--font-body)'
              }}
            />
          </div>
        </div>

        {/* Email */}
        <div>
          <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--color-text-secondary)', fontFamily: 'var(--font-caption)' }}>
            Email Address
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2">
              <Icon name="Mail" size={16} color="var(--color-text-secondary)" />
            </span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e?.target?.value)}
              placeholder="you@example.com"
              className="w-full pl-9 pr-4 py-2.5 rounded-lg text-sm outline-none transition-all"
              style={{
                background: 'var(--color-surface-2)',
                border: '1px solid var(--color-border)',
                color: 'var(--color-text-primary)',
                fontFamily: 'var(--font-body)'
              }}
            />
          </div>
        </div>

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
            background: loading ? 'var(--color-surface-2)' : 'var(--color-primary)',
            color: loading ? 'var(--color-text-secondary)' : '#fff',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontFamily: 'var(--font-caption)'
          }}
        >
          {loading ? <Icon name="Loader2" size={15} className="animate-spin" /> : <Icon name="Save" size={15} />}
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </section>
  );
};

export default PersonalInfoSection;
