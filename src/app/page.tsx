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
        return <div>Carregando...</div>;
    }

    if (!user) {
        return null;
    }

    return (
        <div className="min-h-screen flex flex-col text-gray-800 p-8">
            <main className="flex flex-col justify-center items-center gap-8 flex-grow">
                <section className="w-full max-w-4xl text-center">
                    <h1 className="text-6xl text-orange-900 dark:text-orange-500 mb-4 font-cabinetGrotesk">Techrapy</h1>
                    
                    <p className="text-md text-gray-700 dark:text-white">
                        Bem-vindo, {(user.full_name?.split(' ')[0]) || 'Terapeuta'}! O que deseja fazer hoje?
                    </p>
                    <p className="text-md mt-8 p-4 bg-orange-100 dark:bg-gray-800 rounded-2xl font-bold text-gray-500 dark:text-white">
                        seu ID é {user.id}
                    </p>
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
                </section>
                <div className="absolute flex gap-4 items-center top-4 right-4">
                    <Button onClick={handleLogout} >
                        Logout
                    </Button>
                    <ChangeTheme />
                </div>
            </main>
        </div>
    );
};

export default Home;