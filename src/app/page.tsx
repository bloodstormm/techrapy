import Search from "@/components/Search";
import { createClient } from "@/utils/server";

export default async function Home() {
  const supabase = createClient();
  const { data: patients } = await supabase.from("patients").select();

  console.log(patients);
  
  return (
    <div className="flex items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-8 items-center h-full justify-center w-full">
        <h1 className="text-5xl">Techrapy</h1>
        <Search />
      </main>
    </div>
  );
}
