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
    <form className="flex items-center bg-orange-500/10 border border-orange-700/20 w-1/2 container
     rounded-xl p-4 h-14 hover:shadow-md hover:shadow-orange-700/20 hover:focus-within:shadow-orange-700/20 hover:focus-within:shadow-xl
     focus-within:shadow-xl focus-within:shadow-orange-700/20 transition-all backdrop-blur-md duration-300" onSubmit={(e) => e.preventDefault()}>
      <input
        type="text"
        placeholder={placeholder}
        className="bg-transparent border-none w-full focus:outline-none placeholder-orange-900"
        onChange={handleSearch}
        value={search}
      />
      <button type="submit">
        <MagnifyingGlassIcon className="w-7 h-7 text-orange-900" />
      </button>
    </form>
  )
}

export default SearchBar;
