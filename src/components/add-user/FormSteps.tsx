// @NOTE: in case you are using Next.js
"use client";

import { useState, useEffect } from "react";

import { cn } from "@/lib/utils";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Adult, Child, Teens, Couple } from "../../../public/images";
import { tabs } from "@/types/patientData";

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
import { createPatient, addDisease, addFamilyDisease } from "@/services/patientService";
import { ptBR } from 'date-fns/locale' // Importar a localidade em português
import MaskedInput from 'react-text-mask'; // Importar o MaskedInput
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { toast } from "sonner";
import { supabase } from '@/lib/supabaseClient';
import { useLookupValues } from '@/hooks/useLookupValues';

// Adicione esta interface no início do arquivo
interface FamilyDiseaseWithRelationship {
  disease: string;
  relationship: string;
}

type AnimatedTabsProps = {
  patientType: string;
  containerClassName?: string;
};
export default function FormSteps({
  patientType,
  containerClassName,
}: AnimatedTabsProps) {
  const [date, setDate] = React.useState<Date>()
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [selectedPatientType, setSelectedPatientType] =
    useState<string>(patientType);
  const [selectedTab, setSelectedTab] = useState(tabs[0].title);

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
      therapist_owner: "",
      patient_gender: "",
    },
  });

  // Mover a definição dos estados para fora dos FormFields
  const [selectedDiseases, setSelectedDiseases] = useState<string[]>([]);
  const [selectedFamilyDiseases, setSelectedFamilyDiseases] = useState<FamilyDiseaseWithRelationship[]>([]);

  const [otherDisease, setOtherDisease] = useState("");
  const [otherFamilyDisease, setOtherFamilyDisease] = useState("");
  const [showOtherDiseaseInput, setShowOtherDiseaseInput] = useState(false);
  const [showOtherFamilyDiseaseInput, setShowOtherFamilyDiseaseInput] = useState(false);

  const [selectedDays, setSelectedDays] = useState<string[]>([]);

  const handleDiseaseChange = (value: string) => {
    let newSelectedDiseases: string[];

    if (value === "other") {
      setShowOtherDiseaseInput(true);
      return;
    }

    if (value === "none") {
      newSelectedDiseases = ["Nenhuma"];
      setShowOtherDiseaseInput(false);
    } else {
      if (selectedDiseases.includes("Nenhuma")) {
        newSelectedDiseases = [value];
      } else {
        newSelectedDiseases = selectedDiseases.includes(value)
          ? selectedDiseases.filter((v) => v !== value)
          : [...selectedDiseases, value];
      }
    }

    setSelectedDiseases(newSelectedDiseases);
  };

  const handleFamilyDiseaseChange = (diseaseLabel: string) => {
    if (diseaseLabel === "other") {
      setShowOtherFamilyDiseaseInput(!showOtherFamilyDiseaseInput);
      return;
    }

    setSelectedFamilyDiseases((prev) => {
      const exists = prev.some(item => item.disease === diseaseLabel);
      
      if (exists) {
        return prev.filter(item => item.disease !== diseaseLabel);
      } else {
        if (diseaseLabel === "Nenhuma") {
          return [{ disease: "Nenhuma", relationship: "" }];
        }
        return prev[0]?.disease === "Nenhuma" 
          ? [{ disease: diseaseLabel, relationship: "" }]
          : [...prev, { disease: diseaseLabel, relationship: "" }];
      }
    });
  };

  const handleAddOtherDisease = () => {
    if (otherDisease.trim()) {
      const newSelectedDiseases = [...selectedDiseases, otherDisease.trim()];
      setSelectedDiseases(newSelectedDiseases);
      setOtherDisease("");
      setShowOtherDiseaseInput(false);
    }
  };

  const handleAddOtherFamilyDisease = () => {
    if (otherFamilyDisease.trim()) {
      setSelectedFamilyDiseases(prev => [
        ...prev.filter(item => item.disease !== "Nenhuma"),
        { disease: otherFamilyDisease, relationship: "" }
      ]);
      setOtherFamilyDisease("");
      setShowOtherFamilyDiseaseInput(false);
    }
  };

  const [therapistId, setTherapistId] = useState<string | null>(null);
  const { lookupValues, isLoading, error } = useLookupValues();

  // Mover o useEffect para antes de qualquer renderização condicional
  useEffect(() => {
    const getTherapistId = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setTherapistId(user.id);
        console.log("Terapeuta ID:", user.id); // Debug
      }
    };

    getTherapistId();
  }, []);

  // Renderização condicional após todos os hooks
  if (isLoading) {
    return <div>Carregando...</div>;
  }

  if (error) {
    return <div>Erro ao carregar dados: {error.message}</div>;
  }

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      if (!therapistId) {
        toast.error("Erro: Terapeuta não autenticado. Por favor, faça login novamente.");
        return;
      }

      const patientData = form.getValues();
      patientData.birthdate = date!;
      patientData.patient_type = selectedPatientType;
      patientData.therapist_owner = therapistId;
      console.log("Patient Data:", patientData);

      // Tipar o retorno como Patient
      const createdPatient = await createPatient(patientData);

      // Adicionar doenças do paciente
      for (const disease of selectedDiseases) {
        await addDisease({
          patient_id: createdPatient.patient_id!,
          disease: disease,
          note_id: null, // Ajuste conforme necessário
          created_at: new Date(),
        });
      }

      // Adicionar doenças da família
      for (const disease of selectedFamilyDiseases) {
        await addFamilyDisease({
          patient_id: createdPatient.patient_id!,
          disease: disease.disease,
          relationship: disease.relationship,
          created_at: new Date(),
        });
      }

      localStorage.setItem('successMessage', 'Paciente criado com sucesso');
      window.location.href = "/all-patients";
    } catch (error: any) {
      console.error("Erro completo:", error);
      toast.error(`Erro ao criar paciente: ${error.message}`);
    } finally {
      setIsSaving(false);
    }
  };

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
    <div className={`flex flex-col container gap-4 ${containerClassName || ''}`}>
      <Tabs value={selectedTab} className="w-full mx-auto flex flex-col items-center">
        <TabsList className="w-full py-8 mb-2 rounded-none dark:bg-transparent bg-transparent border-b border-orange-500 dark:border-orange-600 ">
          {tabs.map((tab) => (
            <div key={tab.id} className="flex items-center">
              <TabsTrigger
                value={tab.title}
                onClick={() => setSelectedTab(tab.title)}
                className="border border-transparent rounded-full gap-1 data-[state=active]:border-orange-400 data-[state=active]:text-orange-600 data-[state=active]:bg-orange-400/10"
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
            onSubmit={onSubmit}
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
              <div className="grid gap-x-8 mb-4 gap-y-4 grid-cols-2 items-center justify-center">
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
                      <FormLabel className="leading-[1.7]">Data de Nascimento</FormLabel>
                      <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                        <PopoverTrigger asChild>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "overflow-hidden bg-orange-100 dark:bg-gray-950 h-10 justify-start hover:bg-orange-400/10  dark:text-white",
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
                          {lookupValues.payment_types?.map((item) => (
                            <SelectItem key={item.value} value={item.label}>
                              {item.label}
                            </SelectItem>
                          ))}
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
                      <FormLabel>Dias da sessão</FormLabel>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" className="w-full justify-start bg-orange-100 h-10 hover:bg-orange-10">
                            {selectedDays.length > 0 ? (
                              <p className="gap-y-3 items-center flex flex-wrap">
                                {selectedDays.map((day) => (
                                  <span key={day} className="mr-2 bg-orange-200 rounded-xl p-1 px-2">
                                    {lookupValues.week_days?.find(d => d.label === day)?.label}
                                  </span>
                                ))}
                              </p>
                            ) : (
                              "Selecione os dias da sessão"
                            )}
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56">
                          <DropdownMenuLabel>Dias da Semana</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          {lookupValues.week_days?.map((day) => (
                            <DropdownMenuCheckboxItem
                              key={day.value}
                              checked={selectedDays.includes(day.label)}
                              onCheckedChange={(checked) => {
                                const newSelectedDays = checked
                                  ? [...selectedDays, day.label]
                                  : selectedDays.filter((d) => d !== day.label);
                                setSelectedDays(newSelectedDays);
                                field.onChange(newSelectedDays.join(','));
                              }}
                            >
                              {day.label}
                            </DropdownMenuCheckboxItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
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
                            <MaskedInput
                              mask={['(', /[1-9]/, /\d/, ')', ' ', /\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]}
                              placeholder="Digite o telefone do responsável"
                              className="input-style"
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
                            <MaskedInput
                              mask={['(', /[1-9]/, /\d/, ')', ' ', /\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]}
                              placeholder="Digite o telefone do paciente"
                              className="input-style"
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
                              {lookupValues.marital_status?.map((status) => (
                                <SelectItem key={status.value} value={status.label}>
                                  {status.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormItem>
                      )}
                    />

                  </>
                )}
                <FormField
                  control={form.control}
                  name="patient_gender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gênero do paciente</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o gênero do paciente" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {lookupValues.gender?.map((status) => (
                            <SelectItem key={status.value} value={status.label}>
                              {status.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="more_info_about_patient"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Detalhes adicionais sobre o paciente (Opcional)</FormLabel>
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
              <div className="col-span-2 flex justify-between mt-8">
                <Button type="button" onClick={handleBack}>
                  Voltar
                </Button>
                <Button type="button" onClick={() => handleNext()}>
                  Próximo
                </Button>
              </div>
            </TabsContent>
            <TabsContent value="Histórico">
              <div className="grid gap-x-8 gap-y-4 grid-cols-2 mb-4 items-start justify-center">
                <div>
                  <label>Histórico de doenças</label>
                  <div className="space-y-2">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="w-full bg-orange-100 h-full justify-start hover:bg-orange-400/10 whitespace-normal gap-4 ">
                          {selectedDiseases.length > 0
                            ? selectedDiseases.length === 1 && selectedDiseases[0] === "none"
                              ? "Nenhuma"
                              : (
                                <p className="gap-y-3 items-center flex flex-wrap">
                                  {selectedDiseases.map((disease) => (
                                    <span className="mr-2 bg-orange-200 rounded-xl p-1 px-2 capitalize" key={disease}>
                                      {disease.replace(/_/g, ' ')}
                                    </span>
                                  ))}
                                </p>
                              )
                            : "Nenhuma"}
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-56 self-start">
                        <DropdownMenuLabel>Histórico de Doenças</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        {lookupValues.diseases?.map((disease) => (
                          <DropdownMenuCheckboxItem
                            key={disease.value}
                            checked={selectedDiseases.includes(disease.label)}
                            onCheckedChange={() => handleDiseaseChange(disease.label)}
                          >
                            {disease.label}
                          </DropdownMenuCheckboxItem>
                        ))}
                        <DropdownMenuCheckboxItem
                          checked={showOtherDiseaseInput}
                          onCheckedChange={() => handleDiseaseChange("other")}
                        >
                          Outra doença
                        </DropdownMenuCheckboxItem>
                      </DropdownMenuContent>
                    </DropdownMenu>

                    {showOtherDiseaseInput && (
                      <div className="flex gap-2">
                        <Input
                          value={otherDisease}
                          onChange={(e) => setOtherDisease(e.target.value)}
                          placeholder="Digite o nome da doença"
                        />
                        <Button
                          type="button"
                          onClick={handleAddOtherDisease}
                          variant="outline"
                        >
                          Adicionar
                        </Button>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label>Histórico de doenças na família</label>
                  <div className="space-y-2">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="w-full bg-orange-100 h-full justify-start hover:bg-orange-400/10 whitespace-normal gap-4">
                          {selectedFamilyDiseases.length > 0
                            ? selectedFamilyDiseases.length === 1 && selectedFamilyDiseases[0].disease === "Nenhuma"
                              ? "Nenhuma"
                              : (
                                <p className="gap-y-3 items-center flex flex-wrap">
                                  {selectedFamilyDiseases.map((item) => (
                                    <span className="mr-2 bg-orange-200 rounded-xl p-1 px-2 capitalize" key={item.disease}>
                                      {item.disease}
                                    </span>
                                  ))}
                                </p>
                              )
                            : "Nenhuma"}
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-56 self-start">
                        <DropdownMenuLabel>Histórico de Doenças na Família</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        {lookupValues.diseases?.map((disease) => (
                          <DropdownMenuCheckboxItem
                            key={disease.value}
                            checked={selectedFamilyDiseases.some(d => d.disease === disease.label)}
                            onCheckedChange={() => handleFamilyDiseaseChange(disease.label)}
                          >
                            {disease.label}
                          </DropdownMenuCheckboxItem>
                        ))}
                        <DropdownMenuCheckboxItem
                          checked={showOtherFamilyDiseaseInput}
                          onCheckedChange={() => handleFamilyDiseaseChange("other")}
                        >
                          Outra doença
                        </DropdownMenuCheckboxItem>
                      </DropdownMenuContent>
                    </DropdownMenu>

                    {selectedFamilyDiseases.length > 0 && selectedFamilyDiseases[0].disease !== "Nenhuma" && (
                      <div className="space-y-2 mt-2">
                        {selectedFamilyDiseases.map((item, index) => (
                          <div key={index} className="flex gap-2 items-center">
                            <span className="min-w-[120px]">{item.disease}:</span>
                            <Input
                              value={item.relationship}
                              onChange={(e) => {
                                const newSelectedDiseases = [...selectedFamilyDiseases];
                                newSelectedDiseases[index].relationship = e.target.value;
                                setSelectedFamilyDiseases(newSelectedDiseases);
                              }}
                              placeholder="Digite o parentesco"
                              className="flex-1"
                            />
                          </div>
                        ))}
                      </div>
                    )}

                    {showOtherFamilyDiseaseInput && (
                      <div className="flex gap-2">
                        <Input
                          value={otherFamilyDisease}
                          onChange={(e) => setOtherFamilyDisease(e.target.value)}
                          placeholder="Digite o nome da doença"
                        />
                        <Button
                          type="button"
                          onClick={handleAddOtherFamilyDisease}
                          variant="outline"
                        >
                          Adicionar
                        </Button>
                      </div>
                    )}

                  </div>
                </div>

              </div>

              <FormField
                control={form.control}
                name="more_info_about_diseases"

                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Detalhes adicionais sobre doenças (Opcional)</FormLabel>
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
              <div className="col-span-2 flex justify-between mt-8">
                <Button type="button" onClick={handleBack}>
                  Voltar
                </Button>
                <Button type="submit" form="patientForm">Salvar</Button>
              </div>
            </TabsContent>
          </form>
        </Form>
      </Tabs >
    </div >
  );
}