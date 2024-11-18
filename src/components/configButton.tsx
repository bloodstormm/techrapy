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
        } catch (error: any) {
            toast.error(
                error.message || "Erro ao realizar logout"
            );
        }
    };
    if (pathname === "/login" || pathname === "/register") {
        return null;
    }
    return (
        <DropdownMenu>
            <DropdownMenuTrigger className="fixed z-0 bottom-8 right-8 opacity-20 hover:opacity-100 transition-all duration-300">
                <Cog6ToothIcon className="w-7 h-7" />
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