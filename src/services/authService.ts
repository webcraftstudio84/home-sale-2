import { supabase, isSupabaseConfigured } from './supabaseClient';
import { User, UserRole, AccountStatus } from '../types';

export const authService = {
  /**
   * Get current Supabase auth session
   */
  getSession: async () => {
    if (!isSupabaseConfigured()) return null;
    const { data, error } = await supabase.auth.getSession();
    if (error) {
      console.warn('Get session error:', error.message);
      return null;
    }
    return data.session;
  },

  /**
   * Fetch user profile from public.profiles by user ID
   */
  getProfile: async (userId: string): Promise<User | null> => {
    if (!isSupabaseConfigured()) return null;
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error || !data) return null;

      return {
        id: data.id,
        name: data.name,
        email: data.email,
        phone: data.phone || '',
        role: data.role as UserRole,
        approvalStatus: data.status as AccountStatus,
        avatarUrl: data.avatar_url,
        rejectionReason: data.rejection_reason,
        registeredAt: data.created_at,
      };
    } catch (err) {
      console.error('Error fetching profile from Supabase:', err);
      return null;
    }
  },

  /**
   * Sign up with Supabase Auth + profile metadata
   */
  signUp: async (
    email: string,
    password: string,
    metadata: {
      name: string;
      phone: string;
      role: UserRole;
      status?: AccountStatus;
      avatarUrl?: string;
    }
  ): Promise<{ user?: User; error?: string }> => {
    if (!isSupabaseConfigured()) {
      return {
        user: {
          id: 'user_' + Date.now(),
          name: metadata.name,
          email,
          phone: metadata.phone,
          role: metadata.role,
          approvalStatus: metadata.status || 'active',
          avatarUrl: metadata.avatarUrl,
          registeredAt: new Date().toISOString(),
        },
      };
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: metadata.name,
            phone: metadata.phone,
            role: metadata.role,
            status: metadata.status || 'active',
            avatar_url: metadata.avatarUrl || '',
          },
        },
      });

      if (error) {
        return { error: error.message };
      }

      if (data.user) {
        // Upsert public.profiles row
        await supabase.from('profiles').upsert({
          id: data.user.id,
          name: metadata.name,
          email,
          phone: metadata.phone,
          role: metadata.role,
          status: metadata.status || 'active',
          avatar_url: metadata.avatarUrl || '',
          updated_at: new Date().toISOString(),
        });

        return {
          user: {
            id: data.user.id,
            name: metadata.name,
            email,
            phone: metadata.phone,
            role: metadata.role,
            approvalStatus: metadata.status || 'active',
            avatarUrl: metadata.avatarUrl,
            registeredAt: data.user.created_at,
          },
        };
      }

      return { error: 'Failed to create user account' };
    } catch (err: any) {
      return { error: err?.message || 'Sign up failed' };
    }
  },

  /**
   * Sign in with Email & Password
   */
  signInWithPassword: async (
    email: string,
    password: string
  ): Promise<{ user?: User; error?: string }> => {
    if (!isSupabaseConfigured()) {
      return { error: 'Supabase credentials not configured' };
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { error: error.message };
      }

      if (data.user) {
        const profile = await authService.getProfile(data.user.id);
        if (profile) return { user: profile };

        // Fallback profile from user metadata
        return {
          user: {
            id: data.user.id,
            name: data.user.user_metadata?.name || email.split('@')[0],
            email: data.user.email || email,
            phone: data.user.user_metadata?.phone || '',
            role: (data.user.user_metadata?.role as UserRole) || 'customer',
            approvalStatus: (data.user.user_metadata?.status as AccountStatus) || 'active',
            avatarUrl: data.user.user_metadata?.avatar_url,
            registeredAt: data.user.created_at,
          },
        };
      }

      return { error: 'Authentication failed' };
    } catch (err: any) {
      return { error: err?.message || 'Login error occurred' };
    }
  },

  /**
   * Forgot password / Password reset email
   */
  resetPassword: async (email: string): Promise<{ success: boolean; error?: string }> => {
    if (!isSupabaseConfigured()) {
      return { success: true };
    }
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin,
      });
      if (error) return { success: false, error: error.message };
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Failed to send reset email' };
    }
  },

  /**
   * Sign out
   */
  signOut: async (): Promise<void> => {
    if (isSupabaseConfigured()) {
      try {
        await supabase.auth.signOut();
      } catch (err) {
        console.warn('Sign out warning:', err);
      }
    }
  },

  /**
   * Listen to auth state changes
   */
  onAuthStateChange: (callback: (event: string, session: any) => void) => {
    if (!isSupabaseConfigured()) return { unsubscribe: () => {} };
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      callback(event, session);
    });
    return {
      unsubscribe: () => authListener.subscription.unsubscribe(),
    };
  },
};
