"use client"

import { useEffect, useState, useCallback } from "react";
import PatientCard from "@/components/patientCard";
import { PatientData } from "@/types/patientData";
import { supabase } from "@/lib/supabaseClient";
import { Toaster, toast } from "sonner";
import SearchPatients from "@/components/SearchPatients";
import { PatientProvider } from "@/contexts/PatientContext";
import { deletePatientById } from "@/services/patientService";

const AllUsers = () => {
  const [patients, setPatients] = useState<PatientData[]>([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const successMessage = localStorage.getItem('successMessage');
    if (successMessage) {
      // Adicionando um pequeno atraso antes de mostrar o toast
      const timer = setTimeout(() => {
        toast.success(successMessage);
        localStorage.removeItem('successMessage');
      }, 200);

      // Limpeza do timer para evitar vazamentos de memória
      return () => clearTimeout(timer);
    }
  }, []);

  const fetchPatients = useCallback(async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('patients')
      .select('*');

    if (error) {
      console.error('Error fetching patients:', error);
      toast.error('Erro ao carregar pacientes');
      setIsLoading(false);
      return;
    }

    setPatients(data as PatientData[]);
    setIsLoading(false);
  }, []);

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

  const filteredPatients = patients.filter((item) => 
    item.patient_name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col items-center justify-center mt-16">
      <SearchPatients search={search} setSearch={setSearch} />
      <div className={`${isLoading ? 'flex justify-center' : 'grid'} grid-cols-1 sm:grid-cols-2 md:grid-cols-2 xl:grid-cols-3 mt-10 gap-4 mb-32 container mx-auto w-full`}>
        {isLoading ? (
          <div className="flex flex-col gap-4">
            <div className="flex justify-center items-center">
              <div className="w-16 h-16 border-t-2 border-orange-400 border-solid rounded-full animate-spin"></div>
            </div>
            <p className="text-center text-orange-400 text-xl font-medium">Carregando pacientes...</p>
          </div>
        ) : filteredPatients.length > 0 ? (
          filteredPatients.map(patient => (
            <PatientProvider key={patient.patient_id}>
              <PatientCard patientData={patient} onDeletePatient={handleDeletePatient} />
            </PatientProvider>
          ))
        ) : (
          <div className="col-span-full text-center text-gray-500 text-xl">
            Nenhum paciente encontrado com o nome "{search}".
          </div>
        )}
      </div>
    </div>
  );
};

export default AllUsers;