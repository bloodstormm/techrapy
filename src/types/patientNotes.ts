export interface PatientNote {
    note_id: string;
    note: string;
    image_url: string;
    patient_id: string;
    note_date: string;
    decryptedContent?: string;
}