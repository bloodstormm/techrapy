import { supabase } from '@/lib/supabaseClient';

export async function fetchPatientById(patient_id: string) {
  const { data, error } = await supabase
    .from('patients')
    .select('*')
    .eq('patient_id', patient_id)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function fetchPatientSessions(patient_id: string) {
  const { data, error } = await supabase
    .from('patient_sessions')
    .select('*')
    .eq('patient_id', patient_id);

  if (error) {
    throw new Error(error.message);
  }

  return data;
}
