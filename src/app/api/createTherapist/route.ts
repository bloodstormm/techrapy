import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export async function POST(req: Request) {
    try {
        const { therapist_name, therapist_email, therapist_password } = await req.json();

        // Validação básica dos dados
        if (!therapist_name || !therapist_email || !therapist_password) {
            return NextResponse.json(
                { error: 'Todos os campos são obrigatórios' },
                { status: 400 }
            );
        }

        // Criar usuário no Supabase Auth
        const { data: user, error: authError } = await supabaseAdmin.auth.admin.createUser({
            email: therapist_email,
            password: therapist_password,
            email_confirm: true, // Isso faz com que o email já seja confirmado automaticamente
            user_metadata: {
                full_name: therapist_name
            }
        });

        if (authError) {
            return NextResponse.json(
                { error: authError.message },
                { status: 400 }
            );
        }

        // Inserir dados na tabela 'therapists'
        const { error: profileError } = await supabaseAdmin
            .from('therapists')
            .insert([
                {
                    therapist_id: user.user.id,
                    therapist_name,
                    therapist_email,
                }
            ]);

        if (profileError) {
            // Se houver erro na inserção, deletar o usuário criado
            await supabaseAdmin.auth.admin.deleteUser(user.user.id);
            return NextResponse.json(
                { error: profileError.message },
                { status: 500 }
            );
        }

        // Fazer login automático após o registro
        const { data: sessionData, error: signInError } = await supabaseAdmin.auth.signInWithPassword({
            email: therapist_email,
            password: therapist_password,
        });

        if (signInError) {
            return NextResponse.json(
                { error: signInError.message },
                { status: 400 }
            );
        }

        const response = NextResponse.json(
            { message: 'Terapeuta criado com sucesso', user: user.user },
            { status: 201 }
        );

        // Definir cookies de autenticação
        if (sessionData.session) {
            response.cookies.set('sb-access-token', sessionData.session.access_token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                path: '/',
                sameSite: 'strict',
                maxAge: 60 * 60, // 1 hora
            });

            response.cookies.set('sb-refresh-token', sessionData.session.refresh_token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                path: '/',
                sameSite: 'strict',
                maxAge: 60 * 60 * 24 * 30, // 30 dias
            });
        }

        return response;
    } catch (err: any) {
        console.error('Erro na criação do terapeuta:', err);
        return NextResponse.json(
            { error: 'Erro inesperado ao criar terapeuta' },
            { status: 500 }
        );
    }
}