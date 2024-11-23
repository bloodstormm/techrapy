export type PatientNote = {
    note_id: string;
    note_date: string;
    note: string;
    decryptedContent?: string;
    image_url?: string;
    associatedDiseases?: string[];
    patient_id: string;
}