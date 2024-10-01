'use server'
 
import { supabase } from '@/lib/supabaseClient';

export async function navigate(note: string, patient_id: string): Promise<boolean> {
    const handleSaveNote = async () => {
        const { error } = await supabase.from('patient_notes').insert({
            patient_id: patient_id,
            note: note,
        });
        if (error) {
            console.log(error);
            return false;
        }
        return true;
    };

    const success = await handleSaveNote();

    return success;
}