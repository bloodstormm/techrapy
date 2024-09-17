// @NOTE: in case you are using Next.js
"use client";

import { useState } from "react";

import { motion } from "framer-motion";

import { cn } from "@/lib/utils";

import { InputForm } from "./InputForm";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Nome deve conter pelo menos 2 caracteres.",
  }),
  birthdate: z.string().min(2, {
    message: "Data de nascimento deve conter pelo menos 2 caracteres.",
  }),
});

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
      name: "",
      birthdate: "",
    },
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
  }

  return (
    <div className="flex flex-col container gap-4">
      <div
        onSubmit={(e) => e.preventDefault()}
        className={cn(
          "relative flex flex-wrap w-full items-center justify-center",
          containerClassName
        )}
      >
        <Tabs defaultValue="account" className="w-full">
          <TabsList>
            <TabsTrigger value="info">Informações Básicas</TabsTrigger>
            <TabsTrigger value="historic">Histórico</TabsTrigger>
          </TabsList>
          <TabsContent value="info">
          <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome Completo</FormLabel>
                <FormControl>
                  <Input placeholder="Digite o nome completo do paciente" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="birthdate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Data de Nascimento</FormLabel>
                <FormControl>
                  <Input type="date" placeholder="Digite a data de nascimento do paciente" {...field} />
                </FormControl>
                <FormMessage />
                  </FormItem>
                )}
              />
              </form>
            </Form>
          </TabsContent>
          <TabsContent value="historic">
            <div className="flex flex-col gap-4">
              <h1 className="text-2xl font-bold">Histórico</h1>
              <Button type="submit">Submit</Button>
            </div>

            </TabsContent>
        </Tabs>

      </div>
    </div>
  );
}
