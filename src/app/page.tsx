"use client";

import Search from "@/components/Search";
import { Toaster, toast } from "sonner";

export default function Home() {
  return (
    <div className="flex items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-8 items-center h-full justify-center w-full">
        <h1 className="text-5xl">Techrapy</h1>
        <Search />
        <div>
          <Toaster closeButton richColors position="top-center" />
          <button
            className="bg-primary p-4 rounded-xl text-white font-alata"
            onClick={() => toast.success("My first toast")}
          >
            Give me a toast
          </button>
        </div>
      </main>
    </div>
  );
}
