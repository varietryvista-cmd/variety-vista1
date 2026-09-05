import { Metadata } from 'next';
import { getProfile } from '@/app/actions/profile';
import ProfileSettingsView from './ProfileSettingsView';

export const metadata: Metadata = {
  title: 'Settings | Variety Vista',
};

export default async function SettingsPage() {
  const { data: profile, email, error } = await getProfile();

  return (
    <div>
      <h2 className="text-2xl font-bold text-[#111] mb-2">Account Settings</h2>
      <p className="text-gray-600 mb-8">
        Manage your profile information and personal details.
      </p>

      {error ? (
        <div className="bg-red-50 text-red-600 p-4 rounded-md mb-8">
          {error}
        </div>
      ) : (
        <ProfileSettingsView 
          profile={profile!} 
          email={email || ''} 
        />
      )}
    </div>
  );
}
