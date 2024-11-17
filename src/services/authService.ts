import { supabase } from '@/lib/supabaseClient';
import { User } from '@supabase/supabase-js';

class AuthService {
  async getUser() {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) throw error;
    return user;
  }

  async getSession() {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) throw error;
    return session;
  }

  onAuthStateChange(callback: (user: User | null) => void) {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_, session) => {
        callback(session?.user ?? null);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }
}

export const authService = new AuthService();