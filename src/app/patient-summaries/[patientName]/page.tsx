"use client";

import { PatientData } from "@/types/patientData";
import Link from "next/link";


const patientSummaries = ({ patientName, lastSession }: PatientData) => {
  return (
    <div>
      <h1>{patientName}</h1>
      <p>{lastSession}</p>
      {/* Adicione mais informações conforme necessário */}
      <Link href="/all-users">Voltar</Link>
    </div>
  );
};

export default patientSummaries;
  