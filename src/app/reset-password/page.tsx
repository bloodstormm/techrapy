"use client";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

interface ResetPasswordData {
    password: string;
    confirm_password: string;
}

const ResetPassword = () => {
    const { register, handleSubmit, formState: { errors }, watch } = useForm<ResetPasswordData>();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();
    const supabase = createClientComponentClient();
    const searchParams = useSearchParams();
    const code = searchParams.get('code');

    useEffect(() => {
        if (!code) {
            toast.error("Token de redefinição de senha inválido.");
            router.push("/login");
        }
    }, [code, router]);

    const onSubmit = async (data: ResetPasswordData) => {
        if (data.password !== data.confirm_password) {
            toast.error("As senhas não coincidem");
            return;
        }

        setIsSubmitting(true);
        try {
            const { error } = await supabase.auth.updateUser({
                password: data.password
            });

            if (error) {
                throw error;
            }

            toast.success("Senha redefinida com sucesso!");
            router.push("/login");
        } catch (error: any) {
            toast.error(error.message || "Erro ao redefinir a senha");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex justify-center items-center h-screen">
            <div className="w-full max-w-sm mx-auto p-6 bg-white shadow-md rounded-lg">
                <h1 className="text-2xl font-bold text-center mb-4 text-orange-900">Redefinir Senha</h1>
                <p className="text-center text-gray-700 mb-6">
                    Insira sua nova senha abaixo.
                </p>
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                    <div className="flex flex-col">
                        <label htmlFor="password" className="text-orange-900 mb-2">Nova Senha</label>
                        <Input
                            id="password"
                            type="password"
                            placeholder="•••••••••"
                            {...register("password", {
                                required: "Senha é obrigatória",
                                minLength: {
                                    value: 6,
                                    message: "A senha deve ter pelo menos 6 caracteres",
                                },
                            })}
                            className="h-12"
                        />
                        {errors.password && (
                            <span className="text-red-500 text-sm">
                                {errors.password.message}
                            </span>
                        )}
                    </div>
                    <div className="flex flex-col">
                        <label htmlFor="confirm_password" className="text-orange-900 mb-2">Confirmar Senha</label>
                        <Input
                            id="confirm_password"
                            type="password"
                            placeholder="•••••••••"
                            {...register("confirm_password", {
                                required: "Confirme sua senha",
                                validate: (value) =>
                                    value === watch('password') || "As senhas não coincidem",
                            })}
                            className="h-12"
                        />
                        {errors.confirm_password && (
                            <span className="text-red-500 text-sm">
                                {errors.confirm_password.message}
                            </span>
                        )}
                    </div>
                    <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? "Redefinindo..." : "Redefinir Senha"}
                    </Button>
                </form>
                <div className="flex justify-center mt-4">
                    <Link href="/login" className="text-sm text-orange-500 hover:underline">
                        Voltar para o login
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;
