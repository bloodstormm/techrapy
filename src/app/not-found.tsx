"use client";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { NotFoundImage } from "../../public/images";

export default function NotFound() {
    const router = useRouter();

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-8">
                {/* Texto e Botões */}
                <div className="flex-1 text-center lg:text-left">
                    <h1 className="text-4xl md:text-6xl font-bold text-orange-500 font-cabinetGrotesk mb-4">
                        Oops! Página não encontrada
                    </h1>
                    <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
                        A página que você está procurando parece não existir ou foi movida.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                        <Button
                            onClick={() => router.back()}
                            variant="outline"
                            className="hover:bg-orange-100 dark:hover:bg-orange-950"
                        >
                            Voltar
                        </Button>
                        <Link href="/">
                            <Button className="w-full sm:w-auto bg-orange-500 hover:bg-orange-600">
                                Ir para Home
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Imagem */}
                <div className="flex-1">
                    <Image
                        src={NotFoundImage}
                        alt="404 Ilustração"
                        width={500}
                        height={500}
                        priority
                        className="w-full max-w-[500px] mx-auto"
                    />
                </div>
            </div>
        </div>
    );
} 