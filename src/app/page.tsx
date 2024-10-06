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
    <div className="min-h-screen flex flex-col text-gray-800 p-8">
      <Navbar />
      <main className="flex flex-col justify-center items-center gap-8 flex-grow">
        <section className="w-full max-w-4xl text-center">
          <h1 className="text-6xl text-orange-900 mb-4 font-cabinetGrotesk">Techrapy</h1>
          <p className="text-lg text-orange-800 mb-6">Sua plataforma de gestão de pacientes</p>
        </section>

      </main>
    </div>
  );
}
