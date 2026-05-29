'use client';

import { ReactNode } from 'react';

interface Props {
    children: ReactNode;
}

export const Providers = ({ children }: Props) => {
    return <>{children}</>;
};
