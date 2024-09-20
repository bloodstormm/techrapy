"use client";

import PatientCard from "@/components/patientCard";
import { PatientData } from "@/types/patientData";
import Link from "next/link";

const AllUsers = () => {

  const patients: PatientData[] = [
    { patientName: "maria", lastSession: "Maria expressou ansiedade sobre sua apresentação no trabalho na próxima semana." },
    { patientName: "joao", lastSession: "João compartilhou sua frustração com problemas de comunicação em seu casamento." },
    { patientName: "ana", lastSession: "Ana falou sobre sua luta contra a depressão e como isso afeta seu dia a dia." },
    { patientName: "pedro", lastSession: "Pedro discutiu seu medo de fracassar em sua nova carreira e busca por autoconfiança." },
    { patientName: "carla", lastSession: "Carla mencionou dificuldades em lidar com o luto após a perda recente de um familiar." }
  ];


  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 mt-16 gap-4 container mx-auto">
      {patients.map(patient => (
        <Link key={patient.patientName} href={`/patient-summaries/${patient.patientName}`}>
          <PatientCard patientData={patients} lastSession={patient.lastSession} />
        </Link>
      ))}
    </div>
  );
};

export default AllUsers;