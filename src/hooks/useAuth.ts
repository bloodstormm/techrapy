import { useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { authService } from '@/services/authService';
import { useRouter } from 'next/navigation';

export function useAuth(requireAuth: boolean = true) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const initAuth = async () => {
      try {
        const currentUser = await authService.getUser();
        setUser(currentUser);

        if (requireAuth && !currentUser) {
          router.push('/login');
        }
      } catch (error) {
        console.error('Erro na autenticação:', error);
        if (requireAuth) {
          router.push('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    initAuth();

    return authService.onAuthStateChange(setUser);
  }, [requireAuth, router]);

  return { user, loading };
}