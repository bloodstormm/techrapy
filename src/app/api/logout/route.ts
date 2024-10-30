import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    const response = NextResponse.json({ message: 'Logout realizado com sucesso' });

    // Remove os cookies relacionados à autenticação do supabase
    response.cookies.set('sb-access-token', '', { path: '/' });
    response.cookies.set('sb-refresh-token', '', { path: '/' });

    return response;
}