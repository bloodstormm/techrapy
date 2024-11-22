"use client";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ArrowLeftStartOnRectangleIcon, Cog6ToothIcon } from "@heroicons/react/24/outline";
import ChangeTheme from "@/components/changeTheme";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { usePathname } from "next/navigation";

const ConfigButton = () => {
    const pathname = usePathname();
    const router = useRouter();

    const handleLogout = async () => {
        try {
            const { error } = await supabase.auth.signOut();
            if (error) throw error;
            toast.success('Logout realizado com sucesso');
            router.push("/login");
        } catch (error) {
            toast.error(
                "Erro ao realizar logout"
            );
            console.error(error);
        }
    };
    if (pathname === "/login" || pathname === "/register") {
        return null;
    }
    return (
        <DropdownMenu>
            <DropdownMenuTrigger className="py-6 px-0">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75" />
                </svg>

            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-white dark:bg-background text-center">
                <DropdownMenuItem>
                    <ChangeTheme />
                </DropdownMenuItem>
                <DropdownMenuItem>
                    <span onClick={handleLogout} className="cursor-pointer w-full flex items-center gap-2">
                        <ArrowLeftStartOnRectangleIcon className="w-5 h-5" />
                        Sair
                    </span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default ConfigButton;