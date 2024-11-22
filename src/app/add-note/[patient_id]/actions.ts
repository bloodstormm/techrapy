'use server'
import { supabase } from '@/lib/supabaseClient';

export async function navigate(encryptedNote: string, patientId: string, imageUrl: string) {
  try {
    console.log('Dados recebidos:', {
      encryptedNote: encryptedNote?.substring(0, 50) + '...',
      patientId,
      imageUrl
    });

    const { data, error } = await supabase
      .from('patient_notes')
      .insert([
        {
          note: encryptedNote,
          patient_id: patientId,
          image_url: imageUrl
        }
      ])
      .select();

    if (error) {
      console.error('Erro detalhado do Supabase:', {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint
      });
      throw error;
    }

    console.log('Nota salva com sucesso:', data);
    return { success: true, data };
  } catch (error) {
    console.error('Erro completo ao salvar nota:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Erro desconhecido'
    };
  }
}