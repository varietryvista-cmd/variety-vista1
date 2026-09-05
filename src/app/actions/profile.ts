'use server';

import { createServerClient } from '@/lib/supabase';
import type { Profile } from '@/types';

export async function getProfile() {
  try {
    const supabase = await createServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { error: 'Not authenticated' };
    }

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (error) {
      return { error: error.message };
    }

    return { data: data as Profile, email: user.email };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to fetch profile';
    return { error: message };
  }
}

export async function updateProfile(data: { full_name?: string; phone?: string; avatar_url?: string }) {
  try {
    const supabase = await createServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { error: 'Not authenticated' };
    }

    const { error } = await supabase
      .from('profiles')
      .update(data)
      .eq('id', user.id);

    if (error) {
      return { error: error.message };
    }

    return { success: true };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to update profile';
    return { error: message };
  }
}

export async function uploadAvatar(formData: FormData) {
  try {
    const file = formData.get('file') as File;
    if (!file) {
      return { error: 'No file provided' };
    }

    const supabase = await createServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { error: 'Not authenticated' };
    }

    const fileExt = file.name.split('.').pop();
    const fileName = `${user.id}-${Math.random()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, file);

    if (uploadError) {
      return { error: uploadError.message };
    }

    const { data: { publicUrl } } = supabase.storage
      .from('avatars')
      .getPublicUrl(filePath);

    // Update profile
    await supabase
      .from('profiles')
      .update({ avatar_url: publicUrl })
      .eq('id', user.id);

    return { success: true, url: publicUrl };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to upload avatar';
    return { error: message };
  }
}
