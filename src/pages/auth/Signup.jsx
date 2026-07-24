import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from 'contexts/AuthContext';
import Icon from 'components/AppIcon';

const Signup = () => {
  const navigate = useNavigate();
  const { signUp } = useAuth();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e?.preventDefault();
    setError('');
    if (!fullName || !email || !password) {
      setError('Please fill in all fields.');
      return;
    }
    if (password?.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    setLoading(true);
    const { error: signUpError } = await signUp(email, password, fullName);
    setLoading(false);
    if (signUpError) {
      setError(signUpError?.message || 'Failed to create account.');
    } else {
      navigate('/dashboard', { replace: true });
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-8"
      style={{ background: 'var(--color-background)' }}
    >
      <div
        className="w-full max-w-md rounded-2xl p-8"
        style={{
          background: 'var(--color-card)',
          border: '1px solid var(--color-border)',
          boxShadow: 'var(--shadow-lg)'
        }}
      >
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="flex items-center gap-2 mb-1">
            <img
              src="/assets/images/reel_kanakku_icon_1024-1773074709715.png"
              alt="Reel Kanakku Logo"
              className="w-10 h-10 object-contain"
            />
            <h1
              className="text-2xl font-bold"
              style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text-primary)' }}
            >
              Reel Kanakku
            </h1>
          </div>
          <p className="text-sm mt-1" style={{ color: 'var(--color-text-secondary)' }}>
            Create your account
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name */}
          <div>
            <label
              className="block text-xs font-medium mb-1.5"
              style={{ color: 'var(--color-text-secondary)', fontFamily: 'var(--font-caption)' }}
            >
              Full Name
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2">
                <Icon name="User" size={16} color="var(--color-text-secondary)" />
              </span>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e?.target?.value)}
                placeholder="Your name"
                autoComplete="name"
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
            <label
              className="block text-xs font-medium mb-1.5"
              style={{ color: 'var(--color-text-secondary)', fontFamily: 'var(--font-caption)' }}
            >
              Email
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
                autoComplete="email"
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

          {/* Password */}
          <div>
            <label
              className="block text-xs font-medium mb-1.5"
              style={{ color: 'var(--color-text-secondary)', fontFamily: 'var(--font-caption)' }}
            >
              Password
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2">
                <Icon name="Lock" size={16} color="var(--color-text-secondary)" />
              </span>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e?.target?.value)}
                placeholder="Min. 6 characters"
                autoComplete="new-password"
                className="w-full pl-9 pr-10 py-2.5 rounded-lg text-sm outline-none transition-all"
                style={{
                  background: 'var(--color-surface-2)',
                  border: '1px solid var(--color-border)',
                  color: 'var(--color-text-primary)',
                  fontFamily: 'var(--font-body)'
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2"
                tabIndex={-1}
              >
                <Icon
                  name={showPassword ? 'EyeOff' : 'Eye'}
                  size={16}
                  color="var(--color-text-secondary)"
                />
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label
              className="block text-xs font-medium mb-1.5"
              style={{ color: 'var(--color-text-secondary)', fontFamily: 'var(--font-caption)' }}
            >
              Confirm Password
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2">
                <Icon name="Lock" size={16} color="var(--color-text-secondary)" />
              </span>
              <input
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e?.target?.value)}
                placeholder="Repeat your password"
                autoComplete="new-password"
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

          {/* Error */}
          {error && (
            <div
              className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm"
              style={{
                background: 'rgba(239,68,68,0.1)',
                border: '1px solid rgba(239,68,68,0.3)',
                color: '#ef4444'
              }}
            >
              <Icon name="AlertCircle" size={15} />
              <span>{error}</span>
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-lg text-sm font-semibold transition-all flex items-center justify-center gap-2 mt-2"
            style={{
              background: loading ? 'var(--color-surface-2)' : 'var(--color-primary)',
              color: loading ? 'var(--color-text-secondary)' : '#fff',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontFamily: 'var(--font-caption)'
            }}
          >
            {loading ? (
              <>
                <Icon name="Loader2" size={16} className="animate-spin" />
                Creating account...
              </>
            ) : (
              'Create Account'
            )}
          </button>
        </form>

        <p
          className="text-center text-sm mt-6"
          style={{ color: 'var(--color-text-secondary)' }}
        >
          Already have an account?{' '}
          <Link
            to="/login"
            className="font-semibold"
            style={{ color: 'var(--color-primary)' }}
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
