import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export async function POST(req: Request) {
    try {
        const { therapist_email, therapist_password, remember_me } = await req.json();

        if (!therapist_email || !therapist_password) {
            return NextResponse.json(
                { error: 'Email e senha são obrigatórios' },
                { status: 400 }
            );
        }

        const { data, error } = await supabaseAdmin.auth.signInWithPassword({
            email: therapist_email,
            password: therapist_password,
        });

        if (error || !data.session) {
            return NextResponse.json(
                { error: 'Email ou senha incorretos' },
                { status: 401 }
            );
        }

        const response = NextResponse.json(
            { 
                message: 'Login realizado com sucesso',
                user: {
                    id: data.session.user.id,
                    email: data.session.user.email
                }
            },
            { status: 200 }
        );

        // Definir os parâmetros de expiração com base no "remember_me"
        const accessTokenOptions = {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            path: '/',
            sameSite: 'strict' as const,
            maxAge: remember_me ? 60 * 60 * 24 * 30 : 60 * 60, // 30 dias ou 1 hora
        };

        const refreshTokenOptions = {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            path: '/',
            sameSite: 'strict' as const,
            maxAge: remember_me ? 60 * 60 * 24 * 30 : 60 * 60, // 30 dias ou 1 hora
        };

        response.cookies.set('sb-access-token', data.session.access_token, accessTokenOptions);
        response.cookies.set('sb-refresh-token', data.session.refresh_token, refreshTokenOptions);

        return response;
    } catch (err) {
        console.error('Erro no login:', err);
        return NextResponse.json(
            { error: 'Erro inesperado durante o login' },
            { status: 500 }
        );
    }
} 