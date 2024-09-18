// @NOTE: in case you are using Next.js
"use client";

import { useState } from "react";

import { cn } from "@/lib/utils";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Adult, Child, Teens, Couple } from "../../../public/images";

import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import PatientTypeCard from "./PatientTypeCard";
import { Textarea } from "../ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import React from "react";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Nome deve conter pelo menos 2 caracteres.",
  }),
  birthdate: z.date({
    required_error: "A data de nascimento é obrigatória.",
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
  civil_status: z.string().min(2, {
    message: "Estado civil deve conter pelo menos 2 caracteres.",
  }),
  more_info: z.string().min(2, {
    message: "Mais informações deve conter pelo menos 2 caracteres.",
  }),
  diseases_history: z.string().min(2, {
    message: "Histórico de doenças deve conter pelo menos 2 caracteres.",
  }),
});

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
      title: "Tipo de Paciente",
    },
    {
      title: "Informações Básicas",
    },
    {
      title: "Histórico",
    },
  ];
  const [selectedPatientType, setSelectedPatientType] =
    useState<string>(patientType);
  const [selectedTab, setSelectedTab] = useState(tabs[0].title);
  const [date, setDate] = React.useState<Date>();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      birthdate: new Date(),
      health_insurance: "",
      civil_status: "",
      ppl_in_charge: "",
      ppl_in_charge_phone: "",
      phone: "",
      more_info: "",
      diseases_history: "",
    },
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
  }

  const handleNext = (type?: string) => {
    if (type) {
      setSelectedPatientType(type);
    }
    const currentIndex = tabs.findIndex((tab) => tab.title === selectedTab);
    if (currentIndex < tabs.length - 1) {
      setSelectedTab(tabs[currentIndex + 1].title);
    }
  };

  const handleBack = () => {
    const currentIndex = tabs.findIndex((tab) => tab.title === selectedTab);
    if (currentIndex > 0) {
      setSelectedTab(tabs[currentIndex - 1].title);
    }
  };

  const handlePatientTypeClick = (type: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    handleNext(type);
  };

  return (
    <div className="flex flex-col container gap-4">
      <div
        onSubmit={(e) => e.preventDefault()}
        className={cn("relative flex flex-wrap w-full", containerClassName)}
      >
        <Tabs value={selectedTab} className="w-full">
          <TabsList className="w-full">
            {tabs.map((tab) => (
              <TabsTrigger
                key={tab.title}
                value={tab.title}
                className="w-full"
                onClick={() => setSelectedTab(tab.title)}
              >
                {tab.title}
              </TabsTrigger>
            ))}
          </TabsList>
          <TabsContent value="Tipo de Paciente">
            <div className="grid sm:grid-cols-2 gap-4 items-center rounded-xl p-6 mx-auto max-w-2xl">
              <PatientTypeCard
                src={Child}
                alt="Criança"
                type="child"
                onClick={handlePatientTypeClick("child")}
              />
              <PatientTypeCard
                src={Adult}
                alt="Adulto"
                type="adult"
                onClick={handlePatientTypeClick("adult")}
              />
              <PatientTypeCard
                src={Teens}
                alt="Adolescente"
                type="teen"
                onClick={handlePatientTypeClick("teen")}
              />
              <PatientTypeCard
                src={Couple}
                alt="Casal"
                type="couple"
                onClick={handlePatientTypeClick("couple")}
              />
            </div>
          </TabsContent>
          <TabsContent value="Informações Básicas">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="grid gap-x-8 gap-y-4 grid-cols-2 items-center justify-center"
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome Completo</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Digite o nome completo do paciente"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="birthdate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Data de Nascimento</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full bg-transparent pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Selecione uma data</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) =>
                              date > new Date() || date < new Date("1900-01-01")
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
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
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione uma forma de pagamento" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Convênios</SelectLabel>
                            <SelectItem value="sulamerica">
                              Sulamerica
                            </SelectItem>
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
                <FormField
                  control={form.control}
                  name="civil_status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Estado Civil</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o estado civil" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectGroup>
                            <SelectItem value="solteiro">Solteiro</SelectItem>
                            <SelectItem value="casado">Casado</SelectItem>
                            <SelectItem value="divorciado">
                              Divorciado
                            </SelectItem>
                            <SelectItem value="viuvo">Viuvo</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
                {selectedPatientType !== "child" && (
                  <>
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Telefone do paciente</FormLabel>
                          <FormControl>
                            <Input
                              type="tel"
                              placeholder="Digite a data de nascimento do paciente"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {selectedPatientType === "child" && (
                      <>
                        <FormField
                          control={form.control}
                          name="ppl_in_charge"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Nome do responsável</FormLabel>
                              <FormControl>
                                <Input
                                  type="text"
                                  placeholder="Digite o nome do responsável pela criança"
                                  {...field}
                                />
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
                                <Input
                                  type="tel"
                                  placeholder="Digite o telefone do paciente"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </>
                    )}

                    <FormField
                      control={form.control}
                      name="more_info"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Mais informações</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Digite mais informações sobre o paciente"
                              className="resize-none"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </>
                )}
                <div className="col-span-2 flex justify-between">
                  <Button type="button" onClick={handleBack}>
                    Voltar
                  </Button>
                  <Button type="button" onClick={() => handleNext()}>
                    Próximo
                  </Button>
                </div>
              </form>
            </Form>
          </TabsContent>
          <TabsContent value="Histórico">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="grid gap-x-8 gap-y-4 grid-cols-2 items-center justify-center"
              >
                <FormField
                  control={form.control}
                  name="diseases_history"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Histórico de doenças</FormLabel>

                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o histórico de doenças" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectGroup>
                            <SelectItem value="depressao">Depressão</SelectItem>
                            <SelectItem value="ansiedade">Ansiedade</SelectItem>
                            <SelectItem value="transtorno_bipolar">
                              Transtorno Bipolar
                            </SelectItem>

                            <SelectItem value="esquizofrenia">
                              Esquizofrenia
                            </SelectItem>

                            <SelectItem value="toc">
                              Transtorno Obsessivo-Compulsivo (TOC)
                            </SelectItem>
                            <SelectItem value="transtorno_estresse_pos_traumatico">
                              Transtorno de Estresse Pós-Traumático (TEPT)
                            </SelectItem>
                            <SelectItem value="transtorno_personalidade">
                              Transtorno de Personalidade
                            </SelectItem>
                            <SelectItem value="transtorno_alimentar">
                              Transtorno Alimentar
                            </SelectItem>
                            <SelectItem value="transtorno_somatoforme">
                              Transtorno Somatoforme
                            </SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
                <div className="col-span-2 flex justify-between">
                  <Button type="button" onClick={handleBack}>
                    Voltar
                  </Button>
                  <Button type="submit">Salvar</Button>
                </div>
              </form>
            </Form>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
