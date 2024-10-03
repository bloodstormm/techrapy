"use client"

import { MagnifyingGlassIcon } from "@radix-ui/react-icons";

interface SearchPatientsProps {
  search: string;
  setSearch: (value: string) => void;
}

const SearchPatients = ({ search, setSearch }: SearchPatientsProps) => {
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  }

  return (
    <form className="flex items-center bg-orange-700/10 border border-orange-700/20 w-[700px]
     rounded-xl p-4 h-14 hover:shadow-md hover:shadow-orange-700/20 hover:focus-within:shadow-orange-700/20 hover:focus-within:shadow-xl
     focus-within:shadow-xl focus-within:shadow-orange-700/20 transition-all backdrop-blur-md duration-300" onSubmit={(e) => e.preventDefault()}>
      <input
        type="text"
        placeholder="Procure por um paciente..."
        className="bg-transparent border-none w-full focus:outline-none placeholder-foreground"
        onChange={handleSearch}
        value={search}
      />
      <button type="submit">
        <MagnifyingGlassIcon className="w-7 h-7 text-foreground" />
      </button>
    </form>
  )
}

export default SearchPatients;
