"use client";
import { useEffect, useState } from "react";
import { PatientData } from "@/types/patientData";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import LoadingSpinner from "@/components/loadingSpinner";
import PatientNoteContainer from "@/components/patient-notes/PatientNoteContainer";
import PatientInfoSidebar from "@/components/patient-notes/PatientInfoSidebar";

export default function PatientSummaries({ params }: { params: { patient_id: string } }) {
  const router = useRouter();
  const [patientData, setPatientData] = useState<PatientData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkAuthAndOwnership = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          toast.error("Você precisa estar autenticado para acessar esta página");
          router.push('/login');
          return;
        }

        const { data: patient, error: patientError } = await supabase
          .from('patients')
          .select('*')
          .eq('patient_id', params.patient_id)
          .eq('therapist_owner', user.id)
          .single();

        if (patientError || !patient) {
          toast.error("Você não tem permissão para acessar as notas deste paciente");
          router.push('/all-patients');
          return;
        }

        setPatientData(patient);
      } catch (err) {
        console.error('Erro ao verificar autorização:', err);
        setError('Erro ao carregar dados do paciente');
      } finally {
        setLoading(false);
      }
    };

    checkAuthAndOwnership();
  }, [params.patient_id, router]);

  if (loading) return <LoadingSpinner mensagem="Carregando dados do paciente..." />;
  if (error) return <div className="flex justify-center items-center h-screen">
    <p className="text-center text-orange-400 text-xl font-medium">Error: {error}</p>
  </div>;
  if (!patientData) return <div className="flex justify-center items-center h-screen">
    <p className="text-center text-primary text-xl font-medium">Nenhum paciente encontrado</p>
  </div>;

  return (
    <div className="container mx-auto px-4 md:px-8 xl:px-0 grid grid-cols-1 lg:grid-cols-12 gap-6 mt-10 mb-32">
      <PatientInfoSidebar patientData={patientData} patientId={params.patient_id} />
      <PatientNoteContainer patientData={patientData} patientId={params.patient_id} />
    </div>
  );
}