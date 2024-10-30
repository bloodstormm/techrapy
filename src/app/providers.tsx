'use client';

import { SessionContextProvider } from '@supabase/auth-helpers-react';
import { supabase } from '@/lib/supabaseClient';
import { ReactNode } from 'react';

interface Props {
    children: ReactNode;
}

export const Providers = ({ children }: Props) => {
    return (
        <SessionContextProvider supabaseClient={supabase}>
            {children}
        </SessionContextProvider>
    );
}; 