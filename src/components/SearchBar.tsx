"use client"

import { MagnifyingGlassIcon } from "@radix-ui/react-icons";

interface SearchPatientsProps {
  search: string;
  setSearch: (value: string) => void;
  placeholder: string;
}

const SearchBar = ({ search, setSearch, placeholder }: SearchPatientsProps) => {
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  }

  return (
    <form className="flex items-center bg-[#FCF6F7] border border-orange-700/50 w-1/2 container rounded-xl p-4 h-14 shadow-lg transition-all duration-300" onSubmit={(e) => e.preventDefault()}>
      <input
        type="text"
        placeholder={placeholder}
        className="bg-transparent border-none w-full focus:outline-none placeholder-orange-700 text-orange-900"
        onChange={handleSearch}
        value={search}
      />
      <button type="submit" className="ml-2">
        <MagnifyingGlassIcon className="w-7 h-7 text-orange-700" />
      </button>
    </form>
  )
}

export default SearchBar;
