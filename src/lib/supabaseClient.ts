import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('As variáveis de ambiente do Supabase não estão configuradas');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        persistSession: true,
        storageKey: 'sb-auth-token',
        storage: {
            getItem: (key) => {
                if (typeof window === 'undefined') {
                    return null;
                }
                return window.localStorage.getItem(key);
            },
            setItem: (key, value) => {
                if (typeof window !== 'undefined') {
                    window.localStorage.setItem(key, value);
                }
            },
            removeItem: (key) => {
                if (typeof window !== 'undefined') {
                    window.localStorage.removeItem(key);
                }
            },
        },
    },
});