"use client"

import { MagnifyingGlassIcon } from "@radix-ui/react-icons";

interface SearchPatientsProps {
  search: string;
  setSearch: (value: string) => void;
  placeholder: string;
  className?: string;
}

const SearchBar = ({ search, setSearch, placeholder, className }: SearchPatientsProps) => {
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  }

  return (
    <form className={` ${className} flex items-center bg-[#FCF6F7] dark:bg-background border border-foreground/20 dark:border-foreground/10 w-full container rounded-xl p-4 h-14 transition-all duration-300`} onSubmit={(e) => e.preventDefault()}>
      <input
        type="text"
        placeholder={placeholder}
        className="bg-transparent border-none w-full focus:outline-none placeholder-orange-700 text-orange-900 dark:placeholder-foreground dark:text-foreground"
        onChange={handleSearch}
        value={search}
      />
      <button type="submit" className="ml-2">
        <MagnifyingGlassIcon className="w-7 h-7 text-orange-700 dark:text-foreground" />
      </button>
    </form>
  )
}

export default SearchBar;
