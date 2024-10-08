'use server'
 
import { supabase } from '@/lib/supabaseClient';

export async function navigate(note: string, patient_id: string, imageUrl: string): Promise<boolean> {
    const handleSaveNote = async () => {
        const { error } = await supabase.from('patient_notes').insert({
            patient_id: patient_id,
            note: note,
            image_url: imageUrl
        });

        if (error) {
            console.error('Erro ao inserir nota:', error); // Log de erro
            return false;
        }

        return true;
    };

    const success = await handleSaveNote();

    return success;
}