export interface PatientData {
  created_at?: Date;
  patient_id?: string;
  patient_name: string;
  patient_type: string;
  session_day: string;
  payment_type: string;
  birthdate: Date;
  phone_number: string;
  marital_status?: string;
  patient_gender: string;
  guardian_name?: string;
  guardian_phone_number?: string;
  more_info_about_patient?: string;
  more_info_about_diseases?: string;
  therapist_owner?: string;
}

export interface Disease {
  created_at: Date;
  patient_id: string;
  note_id: string | null;
  disease: string;
}

export interface FamilyDisease {
  created_at: Date;
  patient_id: string;
  relationship: string;
  disease: string;
}


export const tabs = [
  { id: 1, title: "Tipo de Paciente" },
  { id: 2, title: "Informações Básicas" },
  { id: 3, title: "Histórico" },
];

// Tipos base
export type LookupValue = {
  id?: number
  category: LookupCategory
  value: string
  label: string
  active?: boolean
  created_at?: string
  updated_at?: string
}

// Union type com todas as categorias possíveis
export type LookupCategory =
  | 'diseases'
  | 'payment_types'
  | 'marital_status'
  | 'week_days'
  | 'gender'

// Tipo para agrupar os valores por categoria
export type GroupedLookupValues = {
  [K in LookupCategory]: LookupValue[]
}

// Helper function para agrupar os valores
export function groupLookupValues(values: LookupValue[]): GroupedLookupValues {
  return values.reduce((acc, curr) => {
    if (!acc[curr.category]) {
      acc[curr.category] = [];
    }
    acc[curr.category].push(curr);
    return acc;
  }, {} as GroupedLookupValues);
}

