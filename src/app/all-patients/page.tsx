"use client"
import { useEffect, useState, useCallback, useMemo } from "react";
import PatientCard from "@/components/patientCard";
import { PatientData } from "@/types/patientData";
import { supabase } from "@/lib/supabaseClient"; // Usar instância centralizada
import { toast } from "sonner";
import Image from "next/image";
import { PatientProvider } from "@/contexts/PatientContext";
import { deletePatientById } from "@/services/patientService";
import SearchBar from "@/components/SearchBar";
import { No_Patients, No_Results } from "../../../public/images";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useAuth } from '@/hooks/useAuth';
import LoadingSpinner from "@/components/loadingSpinner";

const NoResults = ({ search }: { search: string }) => (
  <div className="col-span-full text-center text-gray-500 text-xl">
    <Image 
      src={No_Results} 
      alt="No Results" 
      className="w-64 h-64 mb-4 mx-auto"
      priority
    />
    <p className="text-orange-900 text-xl font-medium">
      Nenhum paciente encontrado com o nome "{search}".
    </p>
  </div>
);

const NoPatients = () => (
  <div className="col-span-full text-center text-gray-500 ">
    <Image 
      src={No_Patients} 
      alt="No Patients" 
      className="w-80 h-80 mx-auto"
      priority
    />
    <p className="text-foreground text-2xl mb-2 font-semibold">
      Nenhum paciente cadastrado. 
    </p>
    <p className="text-foreground ">
      Adicione o seu primeiro paciente!
    </p>
    <Link href="/add-patient">
      <Button className="mt-8">Adicionar um novo paciente</Button>
    </Link>
  </div>
);

const AllUsers = () => {
  const [patients, setPatients] = useState<PatientData[]>([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const { user, loading } = useAuth();

  const fetchPatients = useCallback(async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('patients')
        .select('*')
        .eq('therapist_owner', user.id)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setPatients(data as PatientData[]);
    } catch (error) {
      console.error("Erro ao carregar pacientes:", error);
      toast.error("Erro ao carregar pacientes");
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchPatients();
    }
  }, [fetchPatients, user]);

  // Gerenciar mensagem de sucesso
  useEffect(() => {
    const successMessage = localStorage.getItem('successMessage');
    if (successMessage) {
      const timer = setTimeout(() => {
        toast.success(successMessage);
        localStorage.removeItem('successMessage');
      }, 200);

      return () => clearTimeout(timer);
    }
  }, []);

  // Otimizar deleção de paciente
  const handleDeletePatient = useCallback(async (patientId: string) => {
    try {
      await deletePatientById(patientId);
      setPatients(prev => prev.filter(patient => patient.patient_id !== patientId));
      toast.success('Paciente excluído com sucesso');
    } catch (error) {
      console.error("Erro ao excluir paciente:", error);
      toast.error('Erro ao excluir o paciente');
    }
  }, []);

  // Memoizar a filtragem de pacientes
  const filteredPatients = useMemo(() => {
    return patients
      .filter(item => 
        item.patient_name.toLowerCase().includes(search.toLowerCase())
      )
      .sort((a, b) => 
        new Date(a.created_at || '').getTime() - new Date(b.created_at || '').getTime()
      );
  }, [patients, search]);

  // Renderização condicional inicial
  if (loading) {
    return <LoadingSpinner mensagem="Carregando..." />;
  }

  return (
    <div className="flex flex-col items-center justify-center mt-16">
      <h1 className="text-orange-900 dark:text-primary text-4xl container text-center mb-2 font-cabinetGrotesk">
        Todos os Pacientes
      </h1>
      <p className="text-lg text-center mb-12">
        Nessa seção você pode ver todos os pacientes cadastrados no seu perfil.
      </p>
      
      {patients.length > 0 && (
        <SearchBar 
          search={search} 
          setSearch={setSearch} 
          placeholder="Procure por um paciente..." 
        />
      )}

      <div
        className={`${
          isLoading ? "flex justify-center" : "grid"
        } grid-cols-1 sm:grid-cols-2 md:grid-cols-2 xl:grid-cols-3 mt-10 gap-4 mb-32 container mx-auto w-full`}
      >
        {isLoading ? (
          <LoadingSpinner mensagem="Carregando pacientes..." />
        ) : filteredPatients.length > 0 ? (
          filteredPatients.map(patient => (
            <section key={patient.patient_id}>
              <PatientProvider>
                <PatientCard 
                  patientData={patient} 
                  onDeletePatient={handleDeletePatient} 
                />
              </PatientProvider>
            </section>
          ))
        ) : search.length > 0 ? (
          <NoResults search={search} />
        ) : (
          <NoPatients />
        )}
      </div>
    </div>
  );
};

export default AllUsers;