import { supabase } from "@/lib/supabaseClient";
import { PatientNote } from "@/types/patientNotes";

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

  console.log('segue as notas aqui patrao', data);

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
  const { error } = await supabase
    .from("patient_notes")
    .delete()
    .eq("note_id", note_id);

  if (error) {
    throw new Error(error.message);
  }
}