"use client"

import ChangeTheme from "@/components/changeTheme";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col text-gray-800 p-8">
      <main className="flex flex-col justify-center items-center gap-8 flex-grow">
        <section className="w-full max-w-4xl text-center">
          <h1 className="text-6xl text-orange-900 mb-4 font-cabinetGrotesk">Techrapy</h1>
          <p className="text-lg text-orange-800 mb-6">Sua plataforma de gestão de pacientes</p>
        </section>
        <div className="absolute top-4 right-4">
          <ChangeTheme />
        </div>
      </main>
    </div>
  );
}
