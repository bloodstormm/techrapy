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

        // Criar usuário no Supabase Auth com os metadados
        const { data: user, error: authError } = await supabaseAdmin.auth.admin.createUser({
            email: therapist_email,
            password: therapist_password,
            email_confirm: true,
            user_metadata: {
                full_name: therapist_name // Adiciona o nome aos metadados
            }
        });

        if (authError) {
            return NextResponse.json(
                { error: authError.message },
                { status: 400 }
            );
        }

        // Inserir dados adicionais na tabela 'therapists'
        const { data, error } = await supabaseAdmin
            .from('therapists')
            .insert([
                {
                    therapist_id: user.user.id, // Atribuir o ID gerado pelo Supabase Auth
                    therapist_name,
                    therapist_email,
                },
            ]);

        if (error) {
            // Opcional: Deletar o usuário caso a inserção na tabela falhe
            await supabaseAdmin.auth.admin.deleteUser(user.user.id);
            return NextResponse.json(
                { error: error.message },
                { status: 500 }
            );
        }

        return NextResponse.json(
            { message: 'Terapeuta criado com sucesso', data },
            { status: 201 }
        );
    } catch (err: any) {
        console.error('Erro na criação do terapeuta:', err);
        return NextResponse.json(
            { error: 'Erro inesperado ao criar terapeuta' },
            { status: 500 }
        );
    }
}