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
import { CalendarIcon, ChevronsUpDown, ChevronRight } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import React from "react";
import { createPatient } from "@/services/patientService";
import { ptBR } from 'date-fns/locale' // Importar a localidade em português
import InputMask from "react-input-mask"; // Importar o InputMask
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";


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
      id: 1,
      title: "Tipo de Paciente",
    },
    {
      id: 2,
      title: "Informações Básicas",
    },
    {
      id: 3,
      title: "Histórico",
    },
  ];
  const [date, setDate] = React.useState<Date>()
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const [selectedPatientType, setSelectedPatientType] =
    useState<string>(patientType);
  const [selectedTab, setSelectedTab] = useState(tabs[0].title);

  const diseasesList = [
    { value: "none", label: "Nenhuma" },
    { value: "depressão", label: "Depressão" },
    { value: "ansiedade", label: "Ansiedade" },
    { value: "transtorno bipolar", label: "Transtorno Bipolar" },
    { value: "esquizofrenia", label: "Esquizofrenia" },
    { value: "TOC", label: "Transtorno Obsessivo-Compulsivo (TOC)" },
    { value: "TEPT", label: "Transtorno de Estresse Pós-Traumático (TEPT)" },
    { value: "transtorno de personalidade", label: "Transtorno de Personalidade" },
    { value: "transtorno alimentar", label: "Transtorno Alimentar" },
    { value: "transtorno somatoforme", label: "Transtorno Somatoforme" },
  ];

  const familyDiseasesList = [
    { value: "none", label: "Nenhuma" },
    { value: "depressão", label: "Depressão" },
    { value: "ansiedade", label: "Ansiedade" },
    { value: "transtorno bipolar", label: "Transtorno Bipolar" },
    { value: "esquizofrenia", label: "Esquizofrenia" },
    { value: "TOC", label: "Transtorno Obsessivo-Compulsivo (TOC)" },
    { value: "TEPT", label: "Transtorno de Estresse Pós-Traumático (TEPT)" },
    { value: "transtorno de personalidade", label: "Transtorno de Personalidade" },
    { value: "transtorno alimentar", label: "Transtorno Alimentar" },
    { value: "transtorno somatoforme", label: "Transtorno Somatoforme" },
  ];

  const form = useForm({
    defaultValues: {
      patient_name: "",
      birthdate: new Date(),
      marital_status: "",
      session_day: "",
      guardian_name: "",
      patient_type: "",
      payment_type: "",
      guardian_phone_number: "",
      phone_number: "",
      more_info_about_patient: "",
      more_info_about_diseases: "",
      family_diseases_history: "",
      diseases_history: "",
    },
  });

  // Mover a definição dos estados para fora dos FormFields
  const [selectedDiseases, setSelectedDiseases] = useState<string[]>([]);
  const [selectedFamilyDiseases, setSelectedFamilyDiseases] = useState<string[]>([]);

  const handleDiseaseChange = (value: string) => {
    let newSelectedDiseases: string[];

    if (value === "none") {
      newSelectedDiseases = ["none"];
    } else {
      if (selectedDiseases.includes("none")) {
        newSelectedDiseases = [value];
      } else {
        newSelectedDiseases = selectedDiseases.includes(value)
          ? selectedDiseases.filter((v) => v !== value)
          : [...selectedDiseases, value];
      }
    }

    setSelectedDiseases(newSelectedDiseases);
    form.setValue("diseases_history", newSelectedDiseases.join(","));
  };

  const handleFamilyDiseaseChange = (value: string) => {
    let newSelectedFamilyDiseases: string[];

    if (value === "none") {
      newSelectedFamilyDiseases = ["none"];
    } else {
      if (selectedFamilyDiseases.includes("none")) {
        newSelectedFamilyDiseases = [value];
      } else {
        newSelectedFamilyDiseases = selectedFamilyDiseases.includes(value)
          ? selectedFamilyDiseases.filter((v) => v !== value)
          : [...selectedFamilyDiseases, value];
      }
    }

    setSelectedFamilyDiseases(newSelectedFamilyDiseases);
    form.setValue("family_diseases_history", newSelectedFamilyDiseases.join(","));
  };

  function onSubmit() {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    const patientData = form.getValues();
    patientData.birthdate = date!;
    patientData.patient_type = selectedPatientType;
    patientData.diseases_history = selectedDiseases.join(",");
    patientData.family_diseases_history = selectedFamilyDiseases.join(",");
    console.log(patientData)
    createPatient(patientData);
    localStorage.setItem('successMessage', 'Paciente criado com sucesso');
    window.location.href = "/all-patients";
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


  console.log(selectedDiseases)

  return (
    <div className={`flex flex-col container gap-4 ${containerClassName || ''}`}>
      <Tabs value={selectedTab} className="w-full mx-auto flex flex-col items-center">
        <TabsList className="w-full py-8 mb-2 rounded-none dark:bg-transparent bg-transparent border-b border-orange-500 dark:border-orange-600 ">
          {tabs.map((tab) => (
            <div className="flex items-center">
              <TabsTrigger
                key={tab.id}
                value={tab.title}
                className=" cursor-auto border border-transparent rounded-full gap-1  data-[state=active]:border-orange-400 data-[state=active]:text-orange-600 data-[state=active]:bg-orange-400/10"
              >
                <span>{tab.id}</span>
                <p>{tab.title}</p>
              </TabsTrigger>
              {tab.id < tabs.length && (
                <ChevronRight className="w-4 h-4 mx-6" />
              )}
            </div>
          ))}
        </TabsList>
        <Form {...form}>
          <form
            id="patientForm"
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full"
          >
            <TabsContent value="Tipo de Paciente">
              <div className="flex gap-4 items-center rounded-xl p-6 mx-auto max-w-4xl">
                <PatientTypeCard
                  src={Child}
                  alt="Criança"
                  type="child"
                  onClick={handlePatientTypeClick("Criança")}
                />
                <PatientTypeCard
                  src={Teens}
                  alt="Adolescente"
                  type="teen"
                  onClick={handlePatientTypeClick("Adolescente")}
                />
                <PatientTypeCard
                  src={Adult}
                  alt="Adulto"
                  type="adult"
                  onClick={handlePatientTypeClick("Adulto")}
                />
              </div>
            </TabsContent>
            <TabsContent value="Informações Básicas">
              <div className="grid gap-x-8 gap-y-4 grid-cols-2 items-center justify-center">
                <FormField
                  control={form.control}
                  name="patient_name"
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
                    <FormItem className="flex w-full flex-col">
                      <FormLabel>Data de Nascimento</FormLabel>
                      <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                        <PopoverTrigger asChild>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "overflow-hidden bg-orange-100 dark:bg-gray-950 justify-start hover:bg-orange-400/10  dark:text-white",
                              !date && "text-muted-foreground",
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {date ? (
                              <span>
                                {window.innerWidth > 1024
                                  ? format(date, "PPP", { locale: ptBR })
                                  : format(date, "d MMM", { locale: ptBR })
                                }
                              </span>
                            ) : (
                              <span className="hidden sm:block">Selecionar uma data</span>
                            )}
                            <ChevronsUpDown className="sm:ml-2 h-4 w-4 shrink-0 opacity-50 " />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={date}
                            onSelect={(e) => {
                              setDate(e);
                              setIsCalendarOpen(false);
                            }}
                            defaultMonth={date || new Date()}
                            captionLayout="dropdown-buttons"
                            fromYear={1990}
                            toYear={2025}
                            locale={ptBR}
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="payment_type"
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
                            <SelectItem value="amil">Amil</SelectItem>
                            <SelectItem value="hapvida">Hapvida</SelectItem>
                            <SelectItem value="notredame">NotreDame</SelectItem>
                            <SelectItem value="porto seguro">Porto Seguro</SelectItem>
                            <SelectItem value="samp">Samp</SelectItem>
                            <SelectItem value="intermedica">Intermédica</SelectItem>
                            <SelectItem value="saude caixa">Saúde Caixa</SelectItem>
                          </SelectGroup>
                          <SelectGroup>
                            <SelectLabel></SelectLabel>
                            <SelectLabel>Particular</SelectLabel>
                            <SelectItem value="dinheiro">Dinheiro</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="session_day"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Dia da sessão</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o dia da sessão" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectGroup>
                            <SelectItem value="segunda-feira">Segunda-feira</SelectItem>
                            <SelectItem value="terça-feira">Terça-feira</SelectItem>
                            <SelectItem value="quarta-feira">Quarta-feira</SelectItem>
                            <SelectItem value="quinta-feira">Quinta-feira</SelectItem>
                            <SelectItem value="sexta-feira">Sexta-feira</SelectItem>
                            <SelectItem value="sábado">Sábado</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {selectedPatientType === "Criança" && (
                  <>
                    <FormField
                      control={form.control}
                      name="guardian_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nome do responsável</FormLabel>
                          <FormControl>
                            <Input
                              type="text"
                              placeholder="Digite o nome do responsável"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="guardian_phone_number"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Telefone do responsável</FormLabel>
                          <FormControl>
                            <InputMask
                              className="input-style"
                              placeholder="Digite o telefone do responsável"
                              mask="(99) 99999-9999"
                              maskChar={null}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </>
                )}

                {selectedPatientType !== "Criança" && (
                  <>
                    <FormField
                      control={form.control}
                      name="phone_number"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Telefone do paciente</FormLabel>
                          <FormControl>
                            <InputMask
                              className="input-style"
                              placeholder="Digite o telefone do paciente"
                              mask="(99) 99999-9999"
                              maskChar={null}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="marital_status"
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

                  </>
                )}
                <FormField
                  control={form.control}
                  name="more_info_about_patient"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mais informações sobre o paciente (Opcional)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Digite mais informações iniciais sobre o paciente"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="col-span-2 flex justify-between mt-4">
                <Button type="button" onClick={handleBack}>
                  Voltar
                </Button>
                <Button type="button" onClick={() => handleNext()}>
                  Próximo
                </Button>
              </div>
            </TabsContent>
            <TabsContent value="Histórico">
              <div className="grid gap-x-8 gap-y-4 grid-cols-2 items-center justify-center">
                <FormField
                  control={form.control}
                  name="diseases_history"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Histórico de doenças</FormLabel>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" className="w-full h-full bg-transparent justify-start hover:bg-orange-400/10 whitespace-normal gap-4 ">
                            {selectedDiseases.length > 0
                              ? selectedDiseases.length === 1 && selectedDiseases[0] === "none"
                                ? "Nenhuma"
                                : (
                                  <p className="gap-y-3 items-center flex flex-wrap">
                                    {selectedDiseases.map((disease) => (
                                      <span className="mr-2 bg-orange-100 rounded-xl p-1 px-2 capitalize" key={disease}>
                                        {disease.replace(/_/g, ' ')}
                                      </span>
                                    ))}
                                  </p>
                                )
                              : "Selecione o histórico de doenças"}
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56 self-start">
                          <DropdownMenuLabel>Histórico de Doenças</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          {diseasesList.map((disease) => (
                            <DropdownMenuCheckboxItem
                              key={disease.value}
                              checked={selectedDiseases.includes(disease.value)}
                              onCheckedChange={() => handleDiseaseChange(disease.value)}
                            >
                              {disease.label}
                            </DropdownMenuCheckboxItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="family_diseases_history"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Histórico de doenças na família</FormLabel>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" className="w-full h-full bg-transparent justify-start hover:bg-orange-400/10 whitespace-normal gap-4">
                            {selectedFamilyDiseases.length > 0
                              ? selectedFamilyDiseases.length === 1 && selectedFamilyDiseases[0] === "none"
                                ? "Nenhuma"
                                : (
                                  <p className="gap-y-3 items-center flex flex-wrap">
                                    {selectedFamilyDiseases.map((disease) => (
                                      <span className="mr-2 bg-orange-100 rounded-xl p-1 px-2 capitalize" key={disease}>
                                        {disease.replace(/_/g, ' ')}
                                      </span>
                                    ))}
                                  </p>
                                )
                              : "Selecione o histórico de doenças na família"}
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56 self-start">
                          <DropdownMenuLabel>Histórico de Doenças na Família</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          {familyDiseasesList.map((disease) => (
                            <DropdownMenuCheckboxItem
                              key={disease.value}
                              checked={selectedFamilyDiseases.includes(disease.value)}
                              onCheckedChange={() => handleFamilyDiseaseChange(disease.value)}
                            >
                              {disease.label}
                            </DropdownMenuCheckboxItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </FormItem>
                  )}
                />


                <FormField
                  control={form.control}
                  name="more_info_about_diseases"

                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mais informações sobre o historico de doenças do paciente</FormLabel>
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

                <div className="col-span-2 flex justify-between mt-4">
                  <Button type="button" onClick={handleBack}>
                    Voltar
                  </Button>
                  <Button type="submit" form="patientForm">Salvar</Button>
                </div>
              </div>
            </TabsContent>
          </form>
        </Form>
      </Tabs >
    </div >
  );
}