import React from 'react';
import { useAuth } from 'contexts/AuthContext';
import TopNavigation from 'components/ui/TopNavigation';

import PersonalInfoSection from './components/PersonalInfoSection';
import PasswordSection from './components/PasswordSection';
import DeleteAccountSection from './components/DeleteAccountSection';

const Profile = () => {
  const { user } = useAuth();

  const initials = user?.user_metadata?.full_name
    ? user?.user_metadata?.full_name?.split(' ')?.map(n => n?.[0])?.join('')?.toUpperCase()?.slice(0, 2)
    : user?.email?.[0]?.toUpperCase() || '?';

  return (
    <div className="min-h-screen" style={{ background: 'var(--color-background)' }}>
      <TopNavigation />
      <main className="pt-16 pb-20 md:pb-8 px-4 md:px-6 lg:px-8 max-w-2xl mx-auto">
        {/* Page Header */}
        <div className="flex items-center gap-4 py-5 md:py-7">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-bold flex-shrink-0"
            style={{
              background: 'var(--color-primary-alpha)',
              border: '1px solid var(--color-primary)',
              color: 'var(--color-primary)',
              fontFamily: 'var(--font-heading)'
            }}
          >
            {initials}
          </div>
          <div>
            <h1
              className="text-2xl md:text-3xl font-bold"
              style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text-primary)' }}
            >
              My Profile
            </h1>
            <p className="text-sm mt-0.5" style={{ color: 'var(--color-text-secondary)' }}>
              {user?.email}
            </p>
          </div>
        </div>

        {/* Sections */}
        <div className="space-y-4">
          <PersonalInfoSection />
          <PasswordSection />
          <DeleteAccountSection />
        </div>
      </main>
    </div>
  );
};

export default Profile;
