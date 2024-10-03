"use client"

import Link from 'next/link';
import Navbar from "@/components/Navbar";
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { supabase } from "@/lib/supabaseClient";

export default function Home() {
  const [patientsCount, setPatientsCount] = useState(0);

  useEffect(() => {
    const fetchPatientsCount = async () => {
      const { count } = await supabase.from("patients").select("*", { count: "exact" });
      setPatientsCount(count || 0);
    };
    fetchPatientsCount();
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-orange-100 to-orange-300 text-gray-800 p-8">
      <Navbar />
      <main className="flex flex-col items-center gap-8">
        <h1 className="text-5xl font-semibold text-orange-900">Bem-vindo ao Techrapy</h1>
        <p className="text-lg text-orange-800">Sua plataforma de gestão de pacientes</p>
        <div className="flex gap-4 mt-8">
          <Link href="/add-patient">
            <button className="px-6 py-3 bg-orange-500 text-white font-semibold rounded-lg shadow-md hover:bg-orange-600 transition duration-300">
              Adicionar Paciente
            </button>
          </Link>
          <Link href="/all-patients">
            <button className="px-6 py-3 bg-orange-400 text-white font-semibold rounded-lg shadow-md hover:bg-orange-500 transition duration-300">
              Ver Todos os Pacientes
            </button>
          </Link>
        </div>
        <div className="mt-12 text-center">
          <h2 className="text-3xl font-medium text-orange-900">Estatísticas Rápidas</h2>
          <p className="text-xl text-orange-800 mt-4">Total de Pacientes: {patientsCount}</p>
        </div>
      </main>
    </div>
  );
}
