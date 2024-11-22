"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { PlusIcon } from "@radix-ui/react-icons";
import { UsersIcon } from "@heroicons/react/24/outline";
import { Techrapy_Image } from "../../public/images";
import Image from "next/image";
import { supabase } from "@/lib/supabaseClient";
import LoadingSpinner from "@/components/loadingSpinner";
interface AuthUser {
    id: string;
    email: string;
    full_name?: string;
}

const Home = () => {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

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

        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
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
    }, [router]);



    if (loading) {
        return <LoadingSpinner mensagem="Carregando..." />;
    }

    if (!user) {
        return null;
    }

    return (
        <main className="flex flex-col justify-center h-screen items-center">
            <div className="h-[55%] px-6 sm:px-0 w-full bg-background flex flex-col justify-center text-center">
                <h1 className="text-5xl md:text-6xl text-foreground dark:text-orange-500 mb-4 font-cabinetGrotesk">Techrapy</h1>

                <p className="text-md text-gray-700 dark:text-white">
                    Bem-vindo, {(user.full_name?.split(' ')[0]) || 'Terapeuta'}! O que deseja fazer hoje?
                </p>
                <div className="flex flex-col sm:flex-row justify-center mt-8 gap-4">
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
            <div className="w-full h-[45%]">
                <Image priority src={Techrapy_Image} alt="Techrapy" width={3840} height={2160} className="w-full h-full object-cover" />
            </div>

        </main>
    );
};

export default Home;