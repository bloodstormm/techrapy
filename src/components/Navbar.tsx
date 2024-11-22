"use client";

import Link from "next/link";
import {
  HomeIcon,
  GlobeAltIcon,
  UserPlusIcon,
} from "@heroicons/react/24/outline";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import ConfigButton from "./configButton";

export default function Navbar() {
  return (
    <nav className="fixed bottom-4 left-0 right-0 sm:w-[400px] max-w-[90%] mx-auto flex justify-center items-center rounded-xl bg-white/60 dark:bg-background/20 backdrop-blur-lg p-2 h-20 border border-[#472417]/30 dark:border-foreground/10 z-10">
      <ul className="flex justify-around items-center px-3 w-full">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <Link href="/" className="p-4 hover:text-primary rounded-xl transition-all duration-300">
                <HomeIcon className="w-7 h-7" />
              </Link>
            </TooltipTrigger>
            <TooltipContent>
              <p>Home</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger>
              <Link href="/all-patients" className="p-4 hover:text-primary rounded-xl transition-all duration-300">
                <GlobeAltIcon className="w-7 h-7" />
              </Link>
            </TooltipTrigger>
            <TooltipContent>
              <p>Todos os Pacientes</p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger>
              <Link href="/add-patient" className="p-4 hover:text-primary rounded-xl transition-all duration-300">
                <UserPlusIcon className="w-7 h-7" />
              </Link>
            </TooltipTrigger>
            <TooltipContent>
              <p>Adicionar Paciente</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <ConfigButton />
            </TooltipTrigger>
            <TooltipContent>
              <p>Configurações</p>
            </TooltipContent>
          </Tooltip>

        </TooltipProvider>

      </ul>
    </nav>
  );
}
