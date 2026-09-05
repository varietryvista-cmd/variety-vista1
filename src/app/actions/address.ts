'use server';

import { createServerClient } from '@/lib/supabase';
import { revalidatePath } from 'next/cache';
import type { Address } from '@/types';

export async function getUserAddresses(): Promise<{ data?: Address[]; error?: string }> {
  try {
    const supabase = await createServerClient();
    
    // Auth check
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: 'Not authenticated' };

    const { data, error } = await supabase
      .from('addresses')
      .select('*')
      .eq('user_id', user.id)
      .order('is_default', { ascending: false })
      .order('created_at', { ascending: false });

    if (error) return { error: error.message };

    return { data: data as Address[] };
  } catch (err: unknown) {
    return { error: err instanceof Error ? err.message : 'An error occurred' };
  }
}

export async function addAddress(addressData: Omit<Address, 'id' | 'user_id' | 'created_at'>): Promise<{ success?: boolean; error?: string }> {
  try {
    const supabase = await createServerClient();
    
    // Auth check
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: 'Not authenticated' };

    // If this is set as default, we need to unset default on others first
    if (addressData.is_default) {
      await supabase
        .from('addresses')
        .update({ is_default: false })
        .eq('user_id', user.id)
        .eq('is_default', true);
    }

    const { error } = await supabase
      .from('addresses')
      .insert({
        ...addressData,
        user_id: user.id
      });

    if (error) return { error: error.message };

    revalidatePath('/account/addresses');
    return { success: true };
  } catch (err: unknown) {
    return { error: err instanceof Error ? err.message : 'An error occurred' };
  }
}

export async function updateAddress(id: string, addressData: Partial<Omit<Address, 'id' | 'user_id' | 'created_at'>>): Promise<{ success?: boolean; error?: string }> {
  try {
    const supabase = await createServerClient();
    
    // Auth check
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: 'Not authenticated' };

    // If this is set as default, we need to unset default on others first
    if (addressData.is_default) {
      await supabase
        .from('addresses')
        .update({ is_default: false })
        .eq('user_id', user.id)
        .eq('is_default', true);
    }

    const { error } = await supabase
      .from('addresses')
      .update(addressData)
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) return { error: error.message };

    revalidatePath('/account/addresses');
    return { success: true };
  } catch (err: unknown) {
    return { error: err instanceof Error ? err.message : 'An error occurred' };
  }
}

export async function deleteAddress(id: string): Promise<{ success?: boolean; error?: string }> {
  try {
    const supabase = await createServerClient();
    
    // Auth check
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: 'Not authenticated' };

    const { error } = await supabase
      .from('addresses')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) return { error: error.message };

    revalidatePath('/account/addresses');
    return { success: true };
  } catch (err: unknown) {
    return { error: err instanceof Error ? err.message : 'An error occurred' };
  }
}

export async function setDefaultAddress(id: string): Promise<{ success?: boolean; error?: string }> {
  try {
    const supabase = await createServerClient();
    
    // Auth check
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: 'Not authenticated' };

    // Unset current default
    await supabase
      .from('addresses')
      .update({ is_default: false })
      .eq('user_id', user.id)
      .eq('is_default', true);

    // Set new default
    const { error } = await supabase
      .from('addresses')
      .update({ is_default: true })
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) return { error: error.message };

    revalidatePath('/account/addresses');
    return { success: true };
  } catch (err: unknown) {
    return { error: err instanceof Error ? err.message : 'An error occurred' };
  }
}
