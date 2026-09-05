'use client';

import * as React from 'react';
import type { Profile } from '@/types';
import Button from '@/components/ui/CustomButton';
import { updateProfile, uploadAvatar } from '@/app/actions/profile';
import { Camera, User as UserIcon } from 'lucide-react';
import Image from 'next/image';

interface ProfileSettingsViewProps {
  profile: Profile;
  email: string;
}

export default function ProfileSettingsView({ profile, email }: ProfileSettingsViewProps) {
  const [formData, setFormData] = React.useState({
    full_name: profile.full_name || '',
    phone: profile.phone || '',
  });
  const [avatarUrl, setAvatarUrl] = React.useState(profile.avatar_url || '');
  
  const [loading, setLoading] = React.useState(false);
  const [avatarLoading, setAvatarLoading] = React.useState(false);
  const [message, setMessage] = React.useState({ type: '', text: '' });

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setMessage({ type: '', text: '' });
  };

  const handleSave = async () => {
    setLoading(true);
    setMessage({ type: '', text: '' });
    
    const { success, error } = await updateProfile(formData);
    
    setLoading(false);
    if (error) {
      setMessage({ type: 'error', text: error });
    } else if (success) {
      setMessage({ type: 'success', text: 'Profile updated successfully.' });
    }
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size (e.g. max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setMessage({ type: 'error', text: 'Image must be less than 5MB.' });
      return;
    }

    setAvatarLoading(true);
    setMessage({ type: '', text: '' });

    const data = new FormData();
    data.append('file', file);

    const { success, url, error } = await uploadAvatar(data);

    setAvatarLoading(false);

    if (error) {
      setMessage({ type: 'error', text: `Avatar upload failed: ${error}` });
    } else if (success && url) {
      setAvatarUrl(url);
      setMessage({ type: 'success', text: 'Profile picture updated.' });
    }
    
    // reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-8">
      {message.text && (
        <div className={`p-4 rounded-lg text-sm font-medium ${message.type === 'error' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-700'}`}>
          {message.text}
        </div>
      )}

      {/* Avatar Section */}
      <div className="border border-gray-100 rounded-xl p-6 bg-white flex flex-col sm:flex-row items-center gap-6 shadow-sm">
        <div className="relative w-24 h-24 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center shrink-0 border border-gray-200">
          {avatarUrl ? (
            <Image 
              src={avatarUrl} 
              alt={formData.full_name || 'Avatar'} 
              fill 
              className="object-cover"
            />
          ) : (
            <UserIcon className="w-10 h-10 text-gray-400" />
          )}
          {avatarLoading && (
            <div className="absolute inset-0 bg-white/70 flex items-center justify-center backdrop-blur-sm">
              <div className="w-5 h-5 border-2 border-[#111] border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
        </div>
        
        <div className="text-center sm:text-left flex-1">
          <h3 className="text-lg font-medium text-gray-900 mb-1">Profile Picture</h3>
          <p className="text-sm text-gray-500 mb-4">PNG, JPG or WEBP under 5MB</p>
          
          <input 
            type="file" 
            accept="image/png, image/jpeg, image/webp" 
            className="hidden" 
            ref={fileInputRef}
            onChange={handleAvatarChange}
          />
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => fileInputRef.current?.click()}
            disabled={avatarLoading}
            className="flex items-center gap-2 mx-auto sm:mx-0"
          >
            <Camera className="w-4 h-4" />
            {avatarUrl ? 'Change Picture' : 'Upload Picture'}
          </Button>
        </div>
      </div>

      {/* Profile Details Form */}
      <div className="border border-gray-100 rounded-xl overflow-hidden shadow-sm bg-white">
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-100">
          <h3 className="font-semibold text-[#111]">Personal Information</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <input 
                type="email" 
                disabled 
                value={email} 
                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-gray-500 cursor-not-allowed"
              />
              <p className="text-xs text-gray-500 mt-2">Your email address cannot be changed directly.</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input 
                type="text" 
                name="full_name"
                value={formData.full_name}
                onChange={handleChange}
                placeholder="Enter your name" 
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[#111] focus:border-transparent outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
              <input 
                type="tel" 
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter your phone number" 
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[#111] focus:border-transparent outline-none"
              />
            </div>
          </div>
          
          <div className="mt-8 flex justify-end pt-6 border-t border-gray-100">
            <Button onClick={handleSave} loading={loading}>
              Save Changes
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
