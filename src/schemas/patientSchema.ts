import { z } from "zod";

export const patientSchema = z.object({
  patient_name: z.string().min(3, "Nome deve ter no mínimo 3 caracteres"),
  birthdate: z.date(),
  marital_status: z.string().optional(),
  session_day: z.string(),
  guardian_name: z.string().optional(),
  patient_type: z.string(),
  payment_type: z.string(),
  guardian_phone_number: z.string().optional(),
  phone_number: z.string().optional(),
  more_info_about_patient: z.string().optional(),
  more_info_about_diseases: z.string().optional(),
  family_diseases_history: z.string(),
  diseases_history: z.string(),
  therapist_owner: z.string(),
  patient_gender: z.string(),
});

export type PatientFormData = z.infer<typeof patientSchema>;