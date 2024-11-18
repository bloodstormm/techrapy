import { useState, useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { patientSchema, PatientFormData } from "@/schemas/patientSchema";
import { supabase } from '@/lib/supabaseClient';
import { createPatient } from "@/services/patientService";
import { toast } from "sonner";

export const usePatientForm = (patientType: string) => {
  const [selectedDiseases, setSelectedDiseases] = useState<string[]>([]);
  const [selectedFamilyDiseases, setSelectedFamilyDiseases] = useState<string[]>([]);
  const [date, setDate] = useState<Date>();
  const [therapistId, setTherapistId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const form = useForm<PatientFormData>({
    resolver: zodResolver(patientSchema),
    defaultValues: {
      patient_name: "",
      birthdate: new Date(),
      marital_status: "",
      session_day: "",
      guardian_name: "",
      patient_type: "",
      payment_type: "",
      guardian_phone_number: "",
      phone_number: "",
      more_info_about_patient: "",
      more_info_about_diseases: "",
      family_diseases_history: "",
      diseases_history: "",
      therapist_owner: "",
    },
  });

  const handleDiseaseChange = useCallback((value: string) => {
    setSelectedDiseases(prev => {
      let newSelected: string[];
      if (value === "none") {
        newSelected = ["none"];
      } else {
        if (prev.includes("none")) {
          newSelected = [value];
        } else {
          newSelected = prev.includes(value)
            ? prev.filter((v) => v !== value)
            : [...prev, value];
        }
      }
      form.setValue("diseases_history", newSelected.join(","));
      return newSelected;
    });
  }, [form]);

  const handleFamilyDiseaseChange = useCallback((value: string) => {
    setSelectedFamilyDiseases(prev => {
      let newSelected: string[];
      if (value === "none") {
        newSelected = ["none"];
      } else {
        if (prev.includes("none")) {
          newSelected = [value];
        } else {
          newSelected = prev.includes(value)
            ? prev.filter((v) => v !== value)
            : [...prev, value];
        }
      }
      form.setValue("family_diseases_history", newSelected.join(","));
      return newSelected;
    });
  }, [form]);

  const onSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      if (!therapistId) {
        toast.error("Erro: Terapeuta não autenticado. Por favor, faça login novamente.");
        return;
      }

      const patientData = form.getValues();
      patientData.birthdate = date!;
      patientData.patient_type = patientType;
      patientData.diseases_history = selectedDiseases.join(",");
      patientData.family_diseases_history = selectedFamilyDiseases.join(",");
      patientData.therapist_owner = therapistId;

      await createPatient(patientData);
      localStorage.setItem('successMessage', 'Paciente criado com sucesso');
      window.location.href = "/all-patients";
    } catch (error: any) {
      console.error("Erro completo:", error);
      toast.error(`Erro ao criar paciente: ${error.message}`);
    } finally {
      setIsSaving(false);
    }
  }, [form, date, patientType, selectedDiseases, selectedFamilyDiseases, therapistId]);

  useEffect(() => {
    const getTherapistId = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setTherapistId(user.id);
      }
    };

    getTherapistId();
  }, []);

  return {
    form,
    selectedDiseases,
    selectedFamilyDiseases,
    date,
    setDate,
    therapistId,
    isSaving,
    handleDiseaseChange,
    handleFamilyDiseaseChange,
    onSubmit,
  };
};