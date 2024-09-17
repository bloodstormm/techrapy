import Link from "next/link";
import { HomeIcon, GlobeAltIcon, UserPlusIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { DropdownMenu } from "./add-user/DropdownMenu";



export default function Button() {
    return (
        <nav className="fixed bottom-4 left-0 right-0 sm:w-2/5 max-w-[70%] mx-auto flex justify-center items-center rounded-xl bg-white/20 backdrop-blur-lg p-2 h-20 border border-stroke z-10">
            <ul className="flex justify-around items-center w-full">
                <div>
                    <DropdownMenu />
                </div>
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
            </ul>
        </nav>
    )
}
