export interface PatientData {
    created_at: Date;
    patient_id: string;
    patient_name: string;
    patient_type: string;
    session_day: string;
    payment_type: string;
    birthdate: Date;
    phone_number: string;
    marital_status: string;
    diseases_history?: string;
    family_diseases_history?: string;
    guardian_name?: string;
    guardian_phone_number?: string;
    more_info_about_patient?: string;
    more_info_about_diseases?: string;
    therapist_owner?: string;
}

export type NewPatientData = Omit<PatientData, "patient_id" | "created_at">;

export const diseasesList = [
    { value: "depressão", label: "Depressão" },
    { value: "ansiedade", label: "Ansiedade" },
    { value: "transtorno bipolar", label: "Transtorno Bipolar" },
    { value: "esquizofrenia", label: "Esquizofrenia" },
    { value: "TOC", label: "Transtorno Obsessivo-Compulsivo (TOC)" },
    { value: "TEPT", label: "Transtorno de Estresse Pós-Traumático (TEPT)" },
    { value: "transtorno de personalidade", label: "Transtorno de Personalidade" },
    { value: "transtorno alimentar", label: "Transtorno Alimentar" },
    { value: "transtorno somatoforme", label: "Transtorno Somatoforme" },
  ];
export const familyDiseasesList = [
    { value: "depressão", label: "Depressão" },
    { value: "ansiedade", label: "Ansiedade" },
    { value: "transtorno bipolar", label: "Transtorno Bipolar" },
    { value: "esquizofrenia", label: "Esquizofrenia" },
    { value: "TOC", label: "Transtorno Obsessivo-Compulsivo (TOC)" },
    { value: "TEPT", label: "Transtorno de Estresse Pós-Traumático (TEPT)" },
    { value: "transtorno de personalidade", label: "Transtorno de Personalidade" },
    { value: "transtorno alimentar", label: "Transtorno Alimentar" },
    { value: "transtorno somatoforme", label: "Transtorno Somatoforme" },
  ];

  export const paymentTypes = [
    { value: "sulamerica", label: "Sulamerica" },
    { value: "bradesco", label: "Bradesco" },
    { value: "unimed", label: "Unimed" },
    { value: "amil", label: "Amil" },
    { value: "hapvida", label: "Hapvida" },
    { value: "notredame", label: "NotreDame" },
    { value: "porto seguro", label: "Porto Seguro" },
    { value: "samp", label: "Samp" },
    { value: "intermedica", label: "Intermédica" },
    { value: "saude caixa", label: "Saúde Caixa" },
    { value: "particular", label: "Particular" },
  ];
  
  export const maritalStatus = [
    { value: "solteiro", label: "Solteiro" },
    { value: "casado", label: "Casado" },
    { value: "divorciado", label: "Divorciado" },
    { value: "viuvo", label: "Viuvo" },
  ];
  
  export const tabs = [
    { id: 1, title: "Tipo de Paciente" },
    { id: 2, title: "Informações Básicas" },
    { id: 3, title: "Histórico" },
  ];
  
  export const weekDays = [
    { value: "segunda-feira", label: "Segunda-feira" },
    { value: "terça-feira", label: "Terça-feira" },
    { value: "quarta-feira", label: "Quarta-feira" },
    { value: "quinta-feira", label: "Quinta-feira" },
    { value: "sexta-feira", label: "Sexta-feira" },
    { value: "sábado", label: "Sábado" },
  ];
  