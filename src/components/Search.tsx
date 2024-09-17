import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

export default function Search() {
  return (
    <div className="flex items-center gap-4 bg-background text-foreground border-primary border w-[700px]
     rounded-xl p-4 h-14 hover:shadow-md hover:shadow-orange-700/20 hover:focus-within:shadow-orange-700/20 hover:focus-within:shadow-xl
     focus-within:shadow-xl focus-within:shadow-orange-700/20 transition-all backdrop-blur-md duration-300">
      <input
        className="bg-transparent border-none w-full focus:outline-none placeholder-foreground"
        type="text"
        placeholder="Pesquise sobre pacientes, notas e comportamentos..."
      />
      <MagnifyingGlassIcon className="w-7 h-7 text-foreground" />
    </div>
  );
}
