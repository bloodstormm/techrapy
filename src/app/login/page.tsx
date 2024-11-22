"use client";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Checkbox } from "@/components/ui/checkbox";
import Image from "next/image";
import { Login_Image } from "../../../public/images";
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { PasswordInput } from "@/components/ui/passwordInput";
import { AuthError } from '@supabase/supabase-js';

interface LoginData {
    therapist_email: string;
    therapist_password: string;
    remember_me: boolean;
}

const Login = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginData>({
        defaultValues: {
            remember_me: false,
        },
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();
    const supabase = createClientComponentClient();

    useEffect(() => {
        const checkUser = async () => {
            try {
                const { data: { session } } = await supabase.auth.getSession();
                if (session) {
                    router.push('/');
                }
            } finally {
                setIsLoading(false);
            }
        };
        
        checkUser();
    }, []);

    const onSubmit = async (data: LoginData) => {
        setIsSubmitting(true);
        try {
            const { data: authData, error } = await supabase.auth.signInWithPassword({
                email: data.therapist_email,
                password: data.therapist_password,
            });

            if (error) {
                throw error;
            }

            if (authData.user) {
                toast.success('Login realizado com sucesso!');
                router.push('/'); // Redireciona para a home
                router.refresh(); // Atualiza o estado da navegação
            }
        } catch (error: unknown) {
            if (error instanceof AuthError) {
                toast.error(
                    error.message === 'Invalid login credentials'
                        ? 'Email ou senha inválidos'
                        : 'Erro ao realizar login'
                );
            } else {
                toast.error('Erro inesperado ao realizar login');
                console.error(error);
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="grid sm:grid-cols-2 grid-cols-1 px-6 sm:px-0 items-center justify-center h-screen">
            {isLoading ? (
                <div className="col-span-2 flex justify-center items-center">
                    Carregando...
                </div>
            ) : (
                <>
                    <div className="w-full max-w-sm mx-auto">
                        <h1 className="text-5xl text-orange-900 dark:text-white mb-4 font-cabinetGrotesk text-center">
                            Techrapy
                        </h1>
                        <p className="text-gray-900 dark:text-white mb-10 text-center">
                            Faça seu login
                        </p>
                        <form
                            onSubmit={handleSubmit(onSubmit)}
                            className="w-full max-w-md flex flex-col sm:gap-4"
                        >
                            <div className="flex flex-col">
                                <label
                                    htmlFor="therapist_email"
                                    className="text-orange-900 dark:text-white mb-2"
                                >
                                    Email
                                </label>
                                <Input
                                    id="therapist_email"
                                    type="email"
                                    placeholder="email@exemplo.com"
                                    {...register("therapist_email", {
                                        required: "Email é obrigatório",
                                        pattern: {
                                            value: /^\S+@\S+$/i,
                                            message: "Email inválido",
                                        },
                                    })}
                                    className="mb-5 h-12"
                                />
                                {errors.therapist_email && (
                                    <span className="text-red-500 -mt-3 text-sm">
                                        {errors.therapist_email.message}
                                    </span>
                                )}
                            </div>

                            <div className="flex flex-col">
                                <label
                                    htmlFor="therapist_password"
                                    className="text-orange-900 dark:text-white mb-2"
                                >
                                    Senha
                                </label>
                                <PasswordInput
                                    placeholder="•••••••••"
                                    id="therapist_password"
                                    {...register("therapist_password", {
                                        required: "Senha é obrigatória",
                                    })}
                                    className="mb-5 h-12"
                                />
                                {errors.therapist_password && (
                                    <span className="text-red-500 -mt-3 text-sm">
                                        {errors.therapist_password.message}
                                    </span>
                                )}
                            </div>

                            <div className="flex items-center justify-between mb-6">
                                <label
                                    htmlFor="remember"
                                    className="text-gray-900 dark:text-white text-sm mb-2 flex items-center"
                                >
                                    <Checkbox id="remember" className="mr-2" {...register("remember_me")} />
                                    Lembrar de mim
                                </label>
                                <Link
                                    href="/forgot-password"
                                    className="text-sm text-orange-500 mb-2 transition-colors duration-150 hover:text-orange-800 underline"
                                >
                                    Esqueceu sua senha?
                                </Link>
                            </div>
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting ? "Entrando..." : "Entrar"}
                            </Button>
                        </form>

                        <div className="flex items-center justify-center mt-12">
                            <p className="text-sm text-gray-800 dark:text-white mb-2 hover:text-orange-900">
                            Não tem uma conta?{" "}
                                <Link
                                    href="/register"
                                    className="underline text-orange-500 transition-colors duration-150 hover:text-orange-800"
                                >
                                    Crie uma agora!
                                </Link>
                            </p>
                        </div>
                    </div>
                    <div className="w-full sm:block hidden">
                        <Image
                            placeholder="blur"
                            src={Login_Image}
                            alt="Login Image"
                            className="h-screen object-cover object-left"
                        />
                    </div>
                </>
            )}
        </div>
    );
};

export default Login;