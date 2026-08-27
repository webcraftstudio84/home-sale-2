import { supabase, isSupabaseConfigured } from './supabaseClient';
import { User, UserRole, AccountStatus } from '../types';

export const adminService = {
  /**
   * Fetch platform users from Supabase profiles
   */
  fetchUsers: async (): Promise<User[]> => {
    if (!isSupabaseConfigured()) return [];

    try {
      const { data, error } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching profiles:', error);
        return [];
      }

      return (data || []).map((u: any) => ({
        id: u.id,
        name: u.name,
        email: u.email,
        phone: u.phone || '',
        role: u.role as UserRole,
        approvalStatus: u.status as AccountStatus,
        avatarUrl: u.avatar_url,
        rejectionReason: u.rejection_reason,
        registeredAt: u.created_at,
      }));
    } catch (err) {
      console.error('Profiles fetch exception:', err);
      return [];
    }
  },

  /**
   * Update user status (approve, suspend, reject, activate)
   */
  updateUserStatus: async (
    userId: string,
    status: AccountStatus,
    rejectionReason?: string
  ): Promise<{ error?: string }> => {
    if (!isSupabaseConfigured()) return {};

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          status,
          rejection_reason: rejectionReason || null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', userId);

      if (error) return { error: error.message };
      return {};
    } catch (err: any) {
      return { error: err?.message || 'Failed to update user status' };
    }
  },
};
