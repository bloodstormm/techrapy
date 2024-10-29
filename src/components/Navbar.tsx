"use client";

import Link from "next/link";
import {
  HomeIcon,
  GlobeAltIcon,
  UserPlusIcon,
} from "@heroicons/react/24/outline";

export default function Navbar() {
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
      </ul>
    </nav>
  );
}
