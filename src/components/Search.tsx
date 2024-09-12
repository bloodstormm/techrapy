import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

export default function Search() {
    return (
        <div className="flex items-center gap-4 bg-[#5C7A77]/20 text-secondary border-[#8FA4A2] border w-[700px] rounded-xl p-4 h-14 hover:shadow-md hover:focus-within:shadow-[#6f908d]/20 hover:focus-within:shadow-xl focus-within:shadow-xl focus-within:shadow-[#6f908d]/20 transition-all duration-300">
            <input className="bg-transparent border-none w-full focus:outline-none placeholder-secondary" type="text" placeholder="Pesquise sobre pacientes, notas e comportamentos..." />
            <MagnifyingGlassIcon className="w-7 h-7 text-secondary" />
        </div>
    )
}