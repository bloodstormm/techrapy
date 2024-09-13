// @NOTE: in case you are using Next.js
"use client";

import { useState } from "react";

import { motion } from "framer-motion";

import { cn } from "../../../utils/cn";

import { InputForm } from "./InputForm";

type AnimatedTabsProps = {
    containerClassName?: string;
    activeTabClassName?: string;
    tabClassName?: string;
};
export default function FormSteps({
    containerClassName,
    activeTabClassName,
    tabClassName,
}: AnimatedTabsProps) {
    const [activeIdx, setActiveIdx] = useState<number>(0);

    const tabs = [
        {
            title: "Informações Básicas",
        },
        {
            title: "Histórico",
        },
    ];

    return (
        <form
            onSubmit={(e) => e.preventDefault()}
            className={cn(
                "relative flex flex-wrap items-center justify-center",
                containerClassName
            )}
        >
            {tabs.map((tab, index) => (
                <button
                    key={tab.title}
                    onClick={() => setActiveIdx(index)}
                    className={cn(
                        "group mb-8 relative z-[1] rounded-full px-4 py-2",
                        { "z-0": activeIdx === index },
                        tabClassName
                    )}
                >
                    {activeIdx === index && (
                        <motion.div
                            layoutId="clicked-button"
                            transition={{ duration: 0.2 }}
                            className={cn(
                                "absolute inset-0 rounded-full bg-secondary/30",
                                activeTabClassName
                            )}
                        />
                    )}
                    <div className="flex items-center gap-2">

                        <div className={cn("border z-10 w-6 h-6 flex items-center border-secondary justify-center rounded-full"
                            )}>
                            <p className={cn(
                                "relative block duration-200 text-secondary",
                                activeIdx === index ? "font-bold delay-100" : "font-normal"
                            )}>{index + 1}</p>

                        </div>
                        <span
                            className={cn(
                                "relative block duration-200 text-secondary",
                                activeIdx === index ? "font-bold delay-100" : "font-normal"
                            )}
                        >
                            {tab.title}
                        </span>
                    </div>
                </button>
            ))}

            <div className="w-full">
                {activeIdx === 0 && (
                    <div className="w-full grid grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1">
                            <label htmlFor="name" className="text-[#121212] text-sm">Nome</label>
                            <InputForm id="name" placeholder="Digite o nome do paciente"/>
                        </div>
                        <div className="flex flex-col gap-1">
                            <label htmlFor="email" className="text-[#121212] text-sm">Email</label>
                            <InputForm id="email" placeholder="Digite o email do paciente"/>
                        </div>
                        <div className="flex flex-col gap-1">
                            <label htmlFor="phone" className="text-[#121212] text-sm">Telefone</label>
                            <InputForm id="phone" placeholder="Digite o telefone do paciente"/>
                        </div>
                    </div>
                )}
                {activeIdx === 1 && (
                    <div className="w-full">
                        <p>olá</p>
                    </div>
                )}
            </div>
        </form>
    );
}
