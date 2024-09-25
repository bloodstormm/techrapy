"use client";

import PatientCard from "@/components/patientCard";
import { PatientData } from "@/types/patientData";
import Link from "next/link";

const AllUsers = () => {

  const patients: PatientData[] = [
    { patient_name: "maria", last_session: "Maria expressou ansiedade sobre sua apresentação no trabalho na próxima semana. Além disso, ela apresentou dificuldades para lidar com o luto após a perda recente de um familiar." },
    { patient_name: "joao", last_session: "João compartilhou sua frustração com problemas de comunicação em seu casamento. Além disso, ele mencionou que está lutando para lidar com o medo de fracassar em sua nova carreira." },
    { patient_name: "ana", last_session: "Ana falou sobre sua luta contra a depressão e como isso afeta seu dia a dia. Porém, ela mencionou que está lutando para lidar com o luto após a perda recente de um familiar." },
    { patient_name: "pedro", last_session: "Pedro discutiu seu medo de fracassar em sua nova carreira e busca por autoconfiança. Contudo, ele mencionou que está lutando para lidar com o medo de fracassar em sua nova carreira." },
    { patient_name: "carla", last_session: "Carla mencionou dificuldades em lidar com o luto após a perda recente de um familiar. Todavia, ela mencionou que está lutando para lidar com o luto após a perda recente de um familiar." }
  ];


  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 mt-16 gap-4 container mx-auto">
      {patients.map(patient => (
        <PatientCard key={patient.patient_name} patientData={patient} lastSession={patient.last_session} />
      ))}
    </div>
  );
};

export default AllUsers;