"use client";
import Image from "next/image";
import { Register_Image } from "../../../public/images";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { createTherapist, TherapistData } from "@/services/therapistService";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { PasswordInput } from "@/components/ui/passwordInput";

const Register = () => {
    const { 
        register, 
        handleSubmit, 
        formState: { errors }, 
        reset, 
        watch 
    } = useForm<TherapistData & { confirm_password: string }>();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();

    const onSubmit = async (data: TherapistData & { confirm_password: string }) => {
        if (data.therapist_password !== data.confirm_password) {
            toast.error("As senhas não coincidem");
            return;
        }

        if (data.therapist_password.length < 6) {
            toast.error("A senha deve ter pelo menos 6 caracteres");
            return;
        }
 
        setIsSubmitting(true);
        try {
            await createTherapist({
                therapist_name: data.therapist_name,
                therapist_email: data.therapist_email,
                therapist_password: data.therapist_password,
            });

            toast.success("Conta criada com sucesso. Aproveite!");
            reset();
            router.push("/login");
        } catch (error) {
            console.error("Erro detalhado:", error);
            if (error instanceof Error) {
                toast.error(error.message);
            } else {
                toast.error("Erro ao criar conta");
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="grid grid-cols-2 items-center justify-center h-screen">
            <div className="w-full ">
                <Image src={Register_Image} alt="Register Image"
                placeholder="blur"
                blurDataURL={Register_Image.src}
                className="h-screen object-cover object-bottom" />
            </div>
            <div className="w-full max-w-sm mx-auto">
                <h1 className="text-5xl text-orange-900 dark:text-foreground mb-4 font-cabinetGrotesk text-center ">Techrapy</h1>
                <p className="text-gray-900 mb-10 text-center">Crie sua conta</p>
                <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-md flex flex-col gap-4">
                    <div className="flex flex-col">
                        <label htmlFor="therapist_name" className="text-orange-900 dark:text-foreground mb-2">Nome Completo</label>
                        <Input 
                            id="therapist_name" 
                            placeholder="Ex: Maria Oliveira" 
                            {...register("therapist_name", { required: "Nome é obrigatório" })} 
                            className="mb-5 h-12" 
                        />
                        {errors.therapist_name && <span className="text-red-500 text-sm">{errors.therapist_name.message}</span>}
                    </div>

                    <div className="flex flex-col">
                        <label htmlFor="therapist_email" className="text-orange-900 dark:text-foreground mb-2">Email</label>
                        <Input 
                            id="therapist_email" 
                            type="email" 
                            placeholder="email@exemplo.com" 
                            {...register("therapist_email", { 
                                required: "Email é obrigatório",
                                pattern: {
                                    value: /^\S+@\S+$/i,
                                    message: "Email inválido"
                                }
                            })} 
                            className="mb-5 h-12" 
                        />
                        {errors.therapist_email && <span className="text-red-500 text-sm">{errors.therapist_email.message}</span>}
                    </div>

                    <div className="flex flex-col">
                        <label htmlFor="therapist_password" className="text-orange-900 dark:text-foreground mb-2">Senha</label>
                        <PasswordInput 
                            id="therapist_password" 
                            placeholder="•••••••••" 
                            {...register("therapist_password", { 
                                required: "Senha é obrigatória", 
                                minLength: { value: 6, message: "A senha deve ter pelo menos 6 caracteres" } 
                            })} 
                            className="mb-5 h-12" 
                        />
                        {errors.therapist_password && <span className="text-red-500 text-sm">{errors.therapist_password.message}</span>}
                    </div>

                    <div className="flex flex-col">
                        <label htmlFor="confirm_password" className="text-orange-900 dark:text-foreground mb-2">Confirmar Senha</label>
                        <PasswordInput 
                            id="confirm_password" 
                            placeholder="•••••••••" 
                            {...register("confirm_password", { required: "Confirme sua senha" })} 
                            className="mb-5 h-12" 
                        />
                        {errors.confirm_password && <span className="text-red-500 text-sm">{errors.confirm_password.message}</span>}
                    </div>

                    <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? "Salvando..." : "Criar conta"}
                    </Button>
                </form>

                <div className="flex items-center justify-center mt-12">
                    <p className="text-sm text-gray-800 mb-2 hover:text-orange-900 dark:text-foreground">Já tem uma conta? <Link href="/login" className="underline text-orange-500">Faça login!</Link></p>
                </div>
            </div>
        </div>
    );
};

export default Register;
