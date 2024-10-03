"use client";

import Link from "next/link";
import {
  HomeIcon,
  GlobeAltIcon,
  UserPlusIcon,
  SunIcon,
  MoonIcon
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
    <nav className="fixed bottom-4 left-0 right-0 sm:w-[500px] max-w-[70%] mx-auto flex justify-center items-center rounded-xl bg-white/20 backdrop-blur-lg p-2 h-20 border border-[#472417]/30 z-10">
      <ul className="flex justify-around items-center w-full">
        <Link href="/" className="p-4 hover:bg-orange-400/20 hover:text-[#071F1D] rounded-xl transition-all duration-300">
          <HomeIcon className="w-7 h-7" />
        </Link>
        <Link href="/all-patients" className="p-4 hover:bg-orange-400/20 hover:text-[#071F1D] rounded-xl transition-all duration-300">
            <GlobeAltIcon className="w-7 h-7" />
        </Link>
        <Link href="/add-patient" className="p-4 hover:bg-orange-400/20 hover:text-[#071F1D] rounded-xl transition-all duration-300">
            <UserPlusIcon className="w-7 h-7" />
        </Link>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant={"link"} size="icon" className="p-0 hover:bg-orange-400/20 hover:text-[#071F1D]">
              <SunIcon className="h-7 w-7 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <MoonIcon className="absolute w-7 h-7 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
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
