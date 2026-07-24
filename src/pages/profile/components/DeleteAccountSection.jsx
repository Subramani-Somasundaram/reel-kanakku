import React, { useState } from 'react';
import { supabase } from '../../../lib/supabase';
import { useAuth } from 'contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import Icon from 'components/AppIcon';

const DeleteAccountSection = () => {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const [showDialog, setShowDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [confirmText, setConfirmText] = useState('');

  const handleDelete = async () => {
    if (confirmText?.trim()?.toUpperCase() !== 'DELETE') {
      setError('Please type DELETE to confirm.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const { error: deleteError } = await supabase?.rpc('delete_user');
      if (deleteError) {
        // Fallback: sign out and inform user
        setError(deleteError?.message || 'Failed to delete account. Please contact support.');
        setLoading(false);
        return;
      }
      await signOut();
      navigate('/login', { replace: true });
    } catch (err) {
      setError('Network error. Please try again.');
      setLoading(false);
    }
  };

  return (
    <>
      <section
        className="rounded-xl p-5 md:p-6"
        style={{ background: 'var(--color-card)', border: '1px solid rgba(239,68,68,0.3)' }}
      >
        <div className="flex items-center gap-3 mb-4">
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)' }}
          >
            <Icon name="Trash2" size={18} color="#ef4444" strokeWidth={1.5} />
          </div>
          <div>
            <h2 className="text-base font-semibold" style={{ fontFamily: 'var(--font-heading)', color: '#ef4444' }}>
              Account Management
            </h2>
            <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>Permanently delete your account and all data</p>
          </div>
        </div>

        <div
          className="flex items-start gap-2.5 p-3.5 rounded-lg mb-4"
          style={{ background: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.2)' }}
        >
          <Icon name="AlertTriangle" size={16} color="#ef4444" className="flex-shrink-0 mt-0.5" />
          <p className="text-xs leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
            Deleting your account is <strong style={{ color: '#ef4444' }}>permanent and irreversible</strong>. All your movie entries, analytics data, and account information will be permanently deleted and cannot be recovered.
          </p>
        </div>

        <button
          onClick={() => setShowDialog(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all"
          style={{
            background: 'rgba(239,68,68,0.1)',
            border: '1px solid rgba(239,68,68,0.3)',
            color: '#ef4444',
            cursor: 'pointer',
            fontFamily: 'var(--font-caption)'
          }}
        >
          <Icon name="Trash2" size={15} />
          Delete Account
        </button>
      </section>

      {/* Confirmation Dialog */}
      {showDialog && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.7)' }}
          onClick={(e) => { if (e?.target === e?.currentTarget) { setShowDialog(false); setConfirmText(''); setError(''); } }}
        >
          <div
            className="w-full max-w-md rounded-2xl p-6"
            style={{ background: 'var(--color-card)', border: '1px solid rgba(239,68,68,0.4)', boxShadow: 'var(--shadow-lg)' }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.4)' }}
              >
                <Icon name="AlertTriangle" size={20} color="#ef4444" strokeWidth={1.5} />
              </div>
              <div>
                <h3 className="text-base font-bold" style={{ fontFamily: 'var(--font-heading)', color: '#ef4444' }}>
                  Delete Account
                </h3>
                <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>This action cannot be undone</p>
              </div>
            </div>

            <p className="text-sm mb-4 leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
              All your data — including movie entries, spending history, and analytics — will be <strong style={{ color: 'var(--color-text-primary)' }}>permanently deleted</strong> and cannot be recovered.
            </p>

            <div className="mb-4">
              <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--color-text-secondary)', fontFamily: 'var(--font-caption)' }}>
                Type <strong style={{ color: '#ef4444' }}>DELETE</strong> to confirm
              </label>
              <input
                type="text"
                value={confirmText}
                onChange={(e) => { setConfirmText(e?.target?.value); setError(''); }}
                placeholder="Type DELETE here"
                className="w-full px-3 py-2.5 rounded-lg text-sm outline-none transition-all"
                style={{
                  background: 'var(--color-surface-2)',
                  border: `1px solid ${error ? 'rgba(239,68,68,0.5)' : 'var(--color-border)'}`,
                  color: 'var(--color-text-primary)',
                  fontFamily: 'var(--font-body)'
                }}
              />
            </div>

            {error && (
              <div
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs mb-4"
                style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#ef4444' }}
              >
                <Icon name="AlertCircle" size={13} />
                <span>{error}</span>
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => { setShowDialog(false); setConfirmText(''); setError(''); }}
                disabled={loading}
                className="flex-1 py-2.5 rounded-lg text-sm font-medium transition-all"
                style={{
                  background: 'var(--color-surface-2)',
                  border: '1px solid var(--color-border)',
                  color: 'var(--color-text-secondary)',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  fontFamily: 'var(--font-caption)'
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={loading}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all"
                style={{
                  background: loading ? 'rgba(239,68,68,0.3)' : '#ef4444',
                  color: '#fff',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  fontFamily: 'var(--font-caption)'
                }}
              >
                {loading ? <Icon name="Loader2" size={15} className="animate-spin" /> : <Icon name="Trash2" size={15} />}
                {loading ? 'Deleting...' : 'Delete Account'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DeleteAccountSection;
