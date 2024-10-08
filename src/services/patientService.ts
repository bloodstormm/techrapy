import { supabase } from "@/lib/supabaseClient";
import { PatientNote } from "@/types/patientNotes";
import { PatientData } from "@/types/patientData";
import { toast } from "sonner";

export const fetchPatientById = async (patient_id: string) => {
  const { data, error } = await supabase
    .from("patients")
    .select("*")
    .eq("patient_id", patient_id)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export const fetchPatientNotes = async (patient_id: string) => {
  const { data, error } = await supabase
    .from("patient_notes")
    .select("*")
    .eq("patient_id", patient_id)
    .order("note_date", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export const fetchLastNote = async (patient_id: string): Promise<PatientNote | null> => {
  const { data, error } = await supabase
    .from("patient_notes")
    .select("*")
    .eq("patient_id", patient_id)
    .order("note_date", { ascending: false })
    .limit(1);

  return data![0] || null;
}

export const fetchPatientNotesCount = async (patient_id: string): Promise<number> => {
  const { count } = await supabase
    .from("patient_notes")
    .select("*", { count: "exact" })
    .eq("patient_id", patient_id)

  return count || 0;
}

export const deleteNoteById = async (note_id: string) => {
  // Buscar a nota para obter a URL da imagem
  const { data: noteData, error: fetchError } = await supabase
    .from("patient_notes")
    .select("image_url")
    .eq("note_id", note_id)
    .single();

  if (fetchError) {
    throw new Error(fetchError.message);
  }

  // Se a nota tiver uma imagem, deletar a imagem do bucket
  if (noteData?.image_url) {
    const imagePath = noteData.image_url.split('/').pop(); // Extrair o nome do arquivo da URL
    const { error: deleteImageError } = await supabase.storage
      .from("notes-images")
      .remove([imagePath]);

    if (deleteImageError) {
      throw new Error(deleteImageError.message);
    }
  }

  // Deletar a nota
  const { error: deleteNoteError } = await supabase
    .from("patient_notes")
    .delete()
    .eq("note_id", note_id);

  if (deleteNoteError) {
    throw new Error(deleteNoteError.message);
  }
}

export const createPatient = async (patientData: Omit<PatientData, 'patient_id' | 'created_at'>) => {
  const { data, error } = await supabase
    .from("patients")
    .insert(patientData);

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

export const deletePatientById = async (patient_id: string) => {
  const { error } = await supabase
    .from("patients")
    .delete()
    .eq("patient_id", patient_id);

  if (error) {
    throw new Error(error.message);
  }
};

export const fetchPatients = async (): Promise<PatientData[]> => {
    const { data, error } = await supabase
        .from('patients')
        .select('*');

    if (error) {
        throw new Error(`Erro ao buscar pacientes: ${error.message}`);
    }

    return data as PatientData[];
};
