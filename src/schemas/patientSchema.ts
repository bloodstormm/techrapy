import { z } from "zod";

export const patientSchema = z.object({
  patient_name: z.string().min(3, "Nome deve ter no mínimo 3 caracteres"),
  birthdate: z.date({
    required_error: "Data de nascimento é obrigatória",
  }),
  marital_status: z.string().optional(),
  session_day: z.string().min(1, "Selecione pelo menos um dia para a sessão"),
  guardian_name: z.string(),
  patient_type: z.string().min(1, "Tipo de paciente é obrigatório"),
  payment_type: z.string().min(1, "Selecione uma forma de pagamento"),
  guardian_phone_number: z.string(),
  phone_number: z.string(),
  more_info_about_patient: z.string().optional(),
  more_info_about_diseases: z.string().optional(),
  therapist_owner: z.string(),
  patient_gender: z.string().min(1, "Selecione o gênero do paciente"),
});

export type PatientFormData = z.infer<typeof patientSchema>;