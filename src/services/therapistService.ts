import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export interface TherapistData {
    therapist_name: string;
    therapist_email: string;
    therapist_password: string;
}

export const createTherapist = async (data: TherapistData) => {
    const supabase = createClientComponentClient();

    try {
        // 1. Criar o usuário na autenticação do Supabase
        const { data: authData, error: authError } = await supabase.auth.signUp({
            email: data.therapist_email,
            password: data.therapist_password,
            options: {
                data: {
                    full_name: data.therapist_name,
                },
            },
        });

        if (authError) {
            throw new Error(authError.message);
        }

        if (!authData.user) {
            throw new Error('Erro ao criar usuário');
        }

        // 2. Inserir dados adicionais na tabela de terapeutas
        const { error: profileError } = await supabase
            .from('therapists')
            .insert([
                {
                    therapist_id: authData.user.id,
                    therapist_name: data.therapist_name,
                    therapist_email: data.therapist_email,
                },
            ]);

        if (profileError) {
            // Se houver erro ao criar o perfil, devemos tentar deletar o usuário criado
            await supabase.auth.admin.deleteUser(authData.user.id);
            throw new Error(profileError.message);
        }

        return authData;
    } catch (error) {
        // Traduzir mensagens de erro comuns
        if (error instanceof Error && error.message.includes('User already registered')) {
            throw new Error('Este e-mail já está registrado');
        }
        throw error;
    }
}; 