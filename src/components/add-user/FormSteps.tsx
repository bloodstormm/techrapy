// @NOTE: in case you are using Next.js
"use client";

import { useState } from "react";

import { motion } from "framer-motion";

import { cn } from "@/lib/utils";

import { InputForm } from "./InputForm";


import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

const formSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
})

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"



type AnimatedTabsProps = {
    patientType: string;
    containerClassName?: string;
    activeTabClassName?: string;
    tabClassName?: string;
};
export default function FormSteps({
    patientType,
    containerClassName,
    activeTabClassName,
    tabClassName,
}: AnimatedTabsProps) {
    const [activeIdx, setActiveIdx] = useState<number>(0);
    const [birthdate, setBirthdate] = useState<string>("");


    const tabs = [
        {
            title: "Informações Básicas",
        },
        {
            title: "Histórico",
        },
    ];

        const form = useForm<z.infer<typeof formSchema>>({
          resolver: zodResolver(formSchema),
          defaultValues: {
            username: "",
          },
        })
       
        // 2. Define a submit handler.
        function onSubmit(values: z.infer<typeof formSchema>) {
          // Do something with the form values.
          // ✅ This will be type-safe and validated.
          console.log(values)
        }


    return (
        <div
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


    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="shadcn" {...field} />
              </FormControl>
              <FormDescription>
                This is your public display name.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>


        </div>
    );
}
