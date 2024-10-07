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
    family_diseases?: string;
    guardian_name?: string;
    guardian_phone_number?: string;
    more_info_about_patient?: string;
    more_info_about_diseases?: string;
}

export type NewPatientData = Omit<PatientData, "patient_id" | "created_at">;