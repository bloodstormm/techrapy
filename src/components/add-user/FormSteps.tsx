// @NOTE: in case you are using Next.js
"use client";

import { useState } from "react";

import { cn } from "@/lib/utils";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
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
  health_insurance: z.string().min(1, {
    message: "Escolha um convenio.",
  }),
  ppl_in_charge: z.string().min(2, {
    message: "Nome deve conter pelo menos 2 caracteres.",
  }),
  ppl_in_charge_phone: z.string().min(2, {
    message: "Telefone deve conter pelo menos 2 caracteres.",
  }),
  phone: z.string().min(2, {
    message: "Telefone deve conter pelo menos 2 caracteres.",
  }),
});

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "../ui/select";

type AnimatedTabsProps = {
  patientType: string;
  containerClassName?: string;
};
export default function FormSteps({
  patientType,
  containerClassName,
}: AnimatedTabsProps) {

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
      health_insurance: "",
      ppl_in_charge: "",
      ppl_in_charge_phone: "",
      phone: "",
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
        <Tabs defaultValue="info" className="w-full">
          <TabsList className="w-full">
            <TabsTrigger value="info" className="w-full ">Informações Básicas</TabsTrigger>
            <TabsTrigger value="historic" className="w-full">Histórico</TabsTrigger>
          </TabsList>
          <TabsContent value="info">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-x-8 gap-y-4 grid-cols-2 items-center justify-center">
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
                <FormField
                  control={form.control}
                  name="health_insurance"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tipo de pagamento</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione uma forma de pagamento" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Convênios</SelectLabel>
                            <SelectItem value="sulamerica">Sulamerica</SelectItem>
                            <SelectItem value="bradesco">Bradesco</SelectItem>
                            <SelectItem value="unimed">Unimed</SelectItem>
                          </SelectGroup>
                          <SelectGroup>
                            <SelectLabel></SelectLabel>
                            <SelectLabel>Particular</SelectLabel>
                            <SelectItem value="dinheiro">Dinheiro</SelectItem>
                            <SelectItem value="Crédito">Crédito</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {patientType === "child" && (
                  <>
                    <FormField
                      control={form.control}
                      name="ppl_in_charge"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nome do responsável</FormLabel>
                          <FormControl>
                            <Input type="text" placeholder="Digite o nome do responsável pela criança" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="ppl_in_charge_phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Telefone do responsável</FormLabel>
                          <FormControl>
                            <Input type="tel" placeholder="Digite o telefone do paciente" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </>
                )}
                {patientType !== "child" && (
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Telefone do paciente</FormLabel>
                        <FormControl>
                          <Input type="tel" placeholder="Digite a data de nascimento do paciente" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              <Button>Submit</Button>

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
