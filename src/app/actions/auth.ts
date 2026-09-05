'use server';

import { createServerClient } from '@/lib/supabase';

export async function resetPasswordForEmail(email: string) {
  try {
    const supabase = await createServerClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback?next=/reset-password`,
    });

    if (error) {
      return { error: error.message };
    }

    return { success: true };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'An error occurred';
    return { error: message };
  }
}

export async function updatePassword(password: string) {
  try {
    const supabase = await createServerClient();
    const { error } = await supabase.auth.updateUser({
      password: password,
    });

    if (error) {
      return { error: error.message };
    }

    return { success: true };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'An error occurred';
    return { error: message };
  }
}
