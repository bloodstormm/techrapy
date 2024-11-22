"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

interface ForgotPasswordData {
    email: string;
}

const ForgotPassword = () => {
    const { register, handleSubmit, formState: { errors } } = useForm<ForgotPasswordData>();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();
    const supabase = createClientComponentClient();

    const onSubmit = async (data: ForgotPasswordData) => {
        setIsSubmitting(true);
        try {
            const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
                redirectTo: `${window.location.origin}/reset-password`,
            });

            if (error) {
                throw error;
            }

            toast.success("Email de redefinição de senha enviado com sucesso!");
            router.push("/login");
        } catch (error) {
            toast.error("Erro ao enviar o email de redefinição de senha");
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex justify-center items-center h-screen">
            <div className="w-full max-w-sm mx-auto p-6 bg-white shadow-md rounded-lg">
                <h1 className="text-2xl font-bold text-center mb-4 text-orange-900">Esqueci Minha Senha</h1>
                <p className="text-center text-gray-700 mb-6">
                    Insira seu email para receber um link de redefinição de senha.
                </p>
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                    <div className="flex flex-col">
                        <label htmlFor="email" className="text-orange-900 mb-2">Email</label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="email@exemplo.com"
                            {...register("email", {
                                required: "Email é obrigatório",
                                pattern: {
                                    value: /^\S+@\S+$/i,
                                    message: "Email inválido",
                                },
                            })}
                            className="h-12"
                        />
                        {errors.email && (
                            <span className="text-red-500 text-sm">
                                {errors.email.message}
                            </span>
                        )}
                    </div>
                    <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? "Enviando..." : "Enviar Link"}
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

export default ForgotPassword;
