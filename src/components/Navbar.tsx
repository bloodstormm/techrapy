"use client";

import Link from "next/link";
import {
  HomeIcon,
  GlobeAltIcon,
  UserPlusIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import { useTheme } from "next-themes";
import {
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenu,
} from "./ui/dropdown-menu";
import { Sun, Moon } from "lucide-react";
import { Button } from "./ui/button";

export default function Navbar() {
  const { setTheme } = useTheme();
  return (
    <nav className="fixed bottom-4 left-0 right-0 sm:w-2/5 max-w-[70%] mx-auto flex justify-center items-center rounded-xl bg-white/20 backdrop-blur-lg p-2 h-20 border border-[#472417]/30 z-10">
      <ul className="flex justify-around items-center w-full">
        <Link href="/">
          <li className="p-4 hover:bg-primary/20 hover:text-[#071F1D] rounded-xl transition-all duration-300">
            <HomeIcon className="w-7 h-7" />
          </li>
        </Link>
        <Link href="/">
          <li className="p-4 hover:bg-primary/20 hover:text-[#071F1D] rounded-xl transition-all duration-300">
            <GlobeAltIcon className="w-7 h-7" />
          </li>
        </Link>
        <Link href="/add-user">
          <li className="p-4 hover:bg-primary/20 hover:text-[#071F1D] rounded-xl transition-all duration-300">
            <UserPlusIcon className="w-7 h-7" />
          </li>
        </Link>
        <Link href="/">
          <li className="p-4 hover:bg-primary/20 hover:text-[#071F1D] rounded-xl transition-all duration-300">
            <MagnifyingGlassIcon className="w-7 h-7" />
          </li>
        </Link>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon">
              <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setTheme("light")}>
              Light
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("dark")}>
              Dark
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("system")}>
              System
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </ul>
    </nav>
  );
}
