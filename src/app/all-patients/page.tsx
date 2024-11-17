"use client"

import { useEffect, useState, useCallback } from "react";
import PatientCard from "@/components/patientCard";
import { PatientData } from "@/types/patientData";
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { toast } from "sonner";
import Image from "next/image";
import { PatientProvider } from "@/contexts/PatientContext";
import { deletePatientById } from "@/services/patientService";
import SearchBar from "@/components/SearchBar";
import { Empty_Notes, No_Patients, No_Results } from "../../../public/images";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const AllUsers = () => {
  const [patients, setPatients] = useState<PatientData[]>([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [therapistId, setTherapistId] = useState<string | null>(null);
  const supabase = createClientComponentClient();

  // Obter o ID do terapeuta autenticado
  useEffect(() => {
    const getTherapistId = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setTherapistId(user.id);
      }
    };

    getTherapistId();
  }, [supabase.auth]);

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

  const fetchPatients = useCallback(async () => {
    if (!therapistId) return; // Não buscar pacientes se não houver ID do terapeuta

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('patients')
        .select('*')
        .eq('therapist_owner', therapistId); // Filtrar por therapist_owner

      if (error) {
        console.error('Error fetching patients:', error);
        toast.error('Erro ao carregar pacientes');
        return;
      }

      setPatients(data as PatientData[]);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Erro ao carregar pacientes');
    } finally {
      setIsLoading(false);
    }
  }, [therapistId, supabase]);

  useEffect(() => {
    fetchPatients();
  }, [fetchPatients]);

  const handleDeletePatient = useCallback(async (patientId: string) => {
    try {
      await deletePatientById(patientId);
      await fetchPatients();
      toast.success('Paciente excluído com sucesso');
    } catch (error) {
      toast.error('Erro ao excluir o paciente: ' + error);
    }
  }, [fetchPatients]);

  const filteredPatients = patients
    .filter((item) =>
      item.patient_name.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());

  // Adicionar verificação de carregamento inicial
  if (!therapistId) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="flex flex-col gap-4">
          <div className="flex justify-center items-center">
            <div className="w-16 h-16 border-t-2 border-orange-900 border-solid rounded-full animate-spin"></div>
          </div>
          <p className="text-center text-orange-900 text-xl font-medium">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center mt-16">
      <h1 className="text-orange-900 text-4xl container text-center mb-2 font-cabinetGrotesk">Todos os Pacientes</h1>
      <p className=" text-lg text-center mb-12">Nessa seção você pode ver todos os pacientes cadastrados no seu perfil.</p>
      {patients.length > 0 && (
        <SearchBar search={search} setSearch={setSearch} placeholder="Procure por um paciente..." />
      )}

      <div className={`${isLoading ? 'flex justify-center' : 'grid'} grid-cols-1 sm:grid-cols-2 md:grid-cols-2 xl:grid-cols-3 mt-10 gap-4 mb-32 container mx-auto w-full`}>

        {isLoading ? (
          <div className="flex flex-col gap-4">
            <div className="flex justify-center items-center">
              <div className="w-16 h-16 border-t-2 border-orange-900 border-solid rounded-full animate-spin"></div>
            </div>
            <p className="text-center text-orange-900 text-xl font-medium">Carregando pacientes...</p>
          </div>
        ) : filteredPatients.length > 0 ? (
          filteredPatients.map(patient => (
            <section>
              <PatientProvider key={patient.patient_id}>
                <PatientCard patientData={patient} onDeletePatient={handleDeletePatient} />
              </PatientProvider>
            </section>
          ))
        ) : filteredPatients.length === 0 && search.length > 0 ? (
          <div className="col-span-full text-center text-gray-500 text-xl">
            <Image src={No_Results} alt="No Results" className="w-64 h-64 mb-4 mt-8 mx-auto" />
            <p className="text-orange-900 text-xl font-medium">
              Nenhum paciente encontrado com o nome "{search}".
            </p>
          </div>
        ) : (
          <div className="col-span-full text-center text-gray-500 text-xl">
            <Image src={No_Patients} alt="No Results" className="w-80 h-80 mb-4 mt-8 mx-auto" />
            <p className="text-orange-900 text-xl font-medium">
              Nenhum paciente cadastrado. <br /> Adicione o seu primeiro paciente!
            </p>
            <Link href="/add-patient">
              <Button className="mt-4">
                Adicionar um novo paciente
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllUsers;