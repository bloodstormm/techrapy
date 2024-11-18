'use server'
import { supabase } from '@/lib/supabaseClient';

export async function navigate(encryptedNote: string, patientId: string, imageUrl: string) {
  try {
    const { error } = await supabase
      .from('patient_notes')
      .insert([
        {
          note: encryptedNote,
          patient_id: patientId,
          image_url: imageUrl
        }
      ]);

    if (error) throw error;
    return { success: true };
  } catch (error: any) {
    console.error('Erro ao salvar nota:', error);
    return { success: false, message: error.message };
  }
}