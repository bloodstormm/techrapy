"use client";

import ChangeTheme from "@/components/changeTheme";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { toast } from 'sonner';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import Link from "next/link";
import { PlusIcon } from "@radix-ui/react-icons";
import { UsersIcon } from "@heroicons/react/24/outline";
import { Login_Image } from "../../public/images";
import Image from "next/image";
interface AuthUser {
    id: string;
    email: string;
    full_name?: string;
}

const Home = () => {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const supabase = createClientComponentClient();

    useEffect(() => {
        const checkUser = async () => {
            try {
                const { data: { user }, error } = await supabase.auth.getUser();

                if (error || !user) {
                    router.push("/login");
                    return;
                }

                setUser({
                    id: user.id,
                    email: user.email || '',
                    full_name: user.user_metadata?.full_name
                });
            } catch (error) {
                console.error("Erro ao verificar sessão:", error);
                router.push("/login");
            } finally {
                setLoading(false);
            }
        };

        // Verificar sessão inicial
        checkUser();

        // Escutar mudanças na autenticação
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((event, session) => {
            if (event === 'SIGNED_IN' && session) {
                setUser({
                    id: session.user.id,
                    email: session.user.email || '',
                    full_name: session.user.user_metadata?.full_name
                });
            }
            if (event === 'SIGNED_OUT') {
                setUser(null);
                router.push('/login');
            }
        });

        return () => {
            subscription.unsubscribe();
        };
    }, []);

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

    if (loading) {
        return <div className="min-h-screen flex flex-col text-gray-800 p-8">Carregando...</div>;
    }

    if (!user) {
        return null;
    }

    return (
        <main className="flex flex-col justify-center h-screen items-center flex-gcol">
            <div className="h-1/2 w-full bg-background flex flex-col justify-center text-center">
                <h1 className="text-6xl text-orange-900 dark:text-orange-500 mb-4 font-cabinetGrotesk">Techrapy</h1>

                <p className="text-md text-gray-700 dark:text-white">
                    Bem-vindo, {(user.full_name?.split(' ')[0]) || 'Terapeuta'}! O que deseja fazer hoje?
                </p>
                {/* <p className="text-md mt-8 p-4 bg-orange-100 dark:bg-gray-800 rounded-2xl font-bold text-gray-500 dark:text-white">
                        seu ID é {user.id}
                    </p> */}
                <div className="flex justify-center mt-8 gap-4">
                    <Button>
                        <Link href="/all-patients" className="flex items-center">
                            <UsersIcon className="w-4 h-4 mr-2" />
                            Gerenciar pacientes
                        </Link>
                    </Button>
                    <Button>
                        <Link href="/add-patient" className="flex items-center">
                            <PlusIcon className="w-4 h-4 mr-2" />
                            Cadastrar paciente
                        </Link>
                    </Button>
                </div>
            </div>
            <div className="w-full h-1/2">
                <Image src="https://images.unsplash.com/photo-1689028293838-a6a66b0ae2c5?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Techrapy" width={3840} height={2160} className="w-full h-full object-cover" />
            </div>
            <div className="absolute flex gap-4 items-center top-4 right-4">
                <Button onClick={handleLogout} >
                    Logout
                </Button>
                <ChangeTheme />
            </div>
        </main>
    );
};

export default Home;