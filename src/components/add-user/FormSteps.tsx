"use client";

import { useState, useEffect } from "react";
import { v4 as uuidv4 } from 'uuid';

// import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "@/lib/utils";

import { useForm } from "react-hook-form";
import { Adult, Child, Teens } from "../../../public/images";
import { tabs } from "@/types/patientData";

import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
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
import { patientSchema, type PatientFormData } from "@/schemas/patientSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import LoadingSpinner from "../loadingSpinner";

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

  const form = useForm<PatientFormData>({
    resolver: zodResolver(patientSchema),
    defaultValues: {
      patient_name: "",
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
    mode: "onSubmit",
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
      // Remover "Nenhuma" se estiver presente
      const newSelectedDiseases = selectedDiseases.filter(d => d !== "none");
      
      // Adicionar a nova doença se ela ainda não existir
      if (!newSelectedDiseases.includes(otherDisease.trim())) {
        newSelectedDiseases.push(otherDisease.trim());
      }
      
      setSelectedDiseases(newSelectedDiseases);
      setOtherDisease("");
      setShowOtherDiseaseInput(false);
    }
  };

  const handleAddOtherFamilyDisease = () => {
    if (otherFamilyDisease.trim()) {
      setSelectedFamilyDiseases(prev => {
        // Remover "Nenhuma" se estiver presente
        const filteredDiseases = prev.filter(item => item.disease !== "Nenhuma");
        
        // Verificar se a doença já existe
        if (!filteredDiseases.some(item => item.disease === otherFamilyDisease.trim())) {
          return [
            ...filteredDiseases,
            { disease: otherFamilyDisease.trim(), relationship: "" }
          ];
        }
        
        return filteredDiseases;
      });
      
      setOtherFamilyDisease("");
      setShowOtherFamilyDiseaseInput(false);
    }
  };

  const [therapistId, setTherapistId] = useState<string | null>(null);
  const { lookupValues, isLoading, error } = useLookupValues();

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

  if (isLoading) {
    return <LoadingSpinner mensagem="Carregando..." />;
  }

  if (error) {
    return <div>Erro ao carregar dados: {error.message}</div>;
  }

  // Modifique o onSubmit para usar o handleSubmit do react-hook-form
  const onSubmit = form.handleSubmit(async (data) => {
    setIsSaving(true);

    try {
      if (!therapistId) {
        toast.error("Erro: Terapeuta não autenticado. Por favor, faça login novamente.");
        return;
      }

      const patientData = {
        patient_name: data.patient_name,
        birthdate: date!,
        marital_status: data.marital_status,
        session_day: data.session_day,
        guardian_name: data.guardian_name,
        patient_type: selectedPatientType,
        payment_type: data.payment_type,
        guardian_phone_number: data.guardian_phone_number,
        phone_number: data.phone_number,
        more_info_about_patient: data.more_info_about_patient,
        more_info_about_diseases: data.more_info_about_diseases,
        therapist_owner: therapistId,
        patient_gender: data.patient_gender,
      };

      console.log("Patient Data:", patientData);

      const createdPatient = await createPatient(patientData);

      // Adicionar doenças do paciente
      for (const disease of selectedDiseases) {
        await addDisease({
          patient_id: createdPatient.patient_id!,
          disease: disease,
          note_id: null,
          created_at: new Date(),
          disease_id: uuidv4(),
        });
      }

      // Adicionar doenças da família
      for (const disease of selectedFamilyDiseases) {
        await addFamilyDisease({
          patient_id: createdPatient.patient_id!,
          disease: disease.disease,
          relationship: disease.relationship,
          created_at: new Date(),
          relative_disease_id: uuidv4(),
        });
      }

      localStorage.setItem('successMessage', 'Paciente criado com sucesso');
      window.location.href = "/all-patients";
    } catch (error) {
      console.error("Erro completo:", error);
      toast.error(`Erro ao criar paciente: consulte o log para mais detalhes`);
    } finally {
      setIsSaving(false);
    }
  });

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
    setSelectedPatientType(type);
    form.setValue('patient_type', type);
    handleNext(type);
  };

  const RequiredField: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <FormLabel className="flex gap-1">
      {children}
      <span className="text-red-500">*</span>
    </FormLabel>
  );

  // Adicione este hook para monitorar a validade do formulário
  const { formState: { isValid, errors } } = form;

  // Adicione um componente para mostrar erros pendentes
  const FormErrors = () => {
    if (Object.keys(errors).length === 0) return null;

    return (
      <div className="bg-orange-50 mt-6 dark:bg-orange-900/10 p-6 rounded-xl mb-4">
        <p className="text-foreground dark:text-orange-400 font-medium mb-2">
          Por favor, preencha todos os campos obrigatórios:
        </p>
        <ul className="list-disc list-inside text-orange-500 dark:text-orange-400">
          {Object.entries(errors).map(([field, error]) => (
            <li key={field}>
              {(() => {
                switch (field) {
                  case 'patient_name':
                    return 'Nome do paciente é obrigatório';
                  case 'birthdate':
                    return 'Data de nascimento é obrigatória';
                  case 'session_day':
                    return 'Selecione pelo menos um dia para a sessão';
                  case 'payment_type':
                    return 'Selecione uma forma de pagamento';
                  case 'patient_gender':
                    return 'Selecione o gênero do paciente';
                  case 'guardian_name':
                    return 'Nome do responsável é obrigatório';
                  case 'guardian_phone_number':
                    return 'Telefone do responsável é obrigatório';
                  case 'phone_number':
                    return 'Telefone do paciente é obrigatório';
                  default:
                    return error?.message || 'Campo obrigatório';
                }
              })()}
            </li>
          ))}
        </ul>
      </div>
    );
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
              <div className="flex flex-col sm:flex-row gap-4 items-center rounded-xl py-4 mx-auto max-w-4xl">
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
              <div className="grid md:gap-x-8 mb-4 gap-y-4 md:grid-cols-2 items-center w-full md:justify-center">
                <FormField
                  control={form.control}
                  name="patient_name"
                  render={({ field }) => (
                    <FormItem>
                      <RequiredField>Nome Completo</RequiredField>
                      <FormControl>
                        <Input
                          placeholder="Digite o nome completo do paciente"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="birthdate"
                  render={({ field }) => (
                    <FormItem className="flex w-full flex-col">
                      <RequiredField>Data de Nascimento</RequiredField>
                      <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "overflow-hidden bg-orange-100 dark:bg-gray-950 h-10 justify-start hover:bg-orange-400/10 dark:text-white w-full",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {field.value ? (
                                <span>
                                  {format(field.value, "PPP", { locale: ptBR })}
                                </span>
                              ) : (
                                <span className="hidden sm:block">Selecionar uma data</span>
                              )}
                              <ChevronsUpDown className="sm:ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={(date) => {
                              field.onChange(date);
                              setDate(date);
                              setIsCalendarOpen(false);
                            }}
                            defaultMonth={field.value || new Date()}
                            captionLayout="dropdown-buttons"
                            fromYear={1990}
                            toYear={2025}
                            locale={ptBR}
                          />
                        </PopoverContent>
                      </Popover>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="payment_type"
                  render={({ field }) => (
                    <FormItem>
                      <RequiredField>Tipo de pagamento</RequiredField>
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
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="session_day"
                  render={({ field }) => (
                    <FormItem>
                      <RequiredField>Dias da sessão</RequiredField>
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
                              <p className="text-muted-foreground">
                                Selecione os dias da sessão
                              </p>
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
                          <RequiredField>Nome do responsável</RequiredField>
                          <FormControl>
                            <Input
                              type="text"
                              placeholder="Digite o nome do responsável"
                              {...field}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="guardian_phone_number"
                      render={({ field }) => (
                        <FormItem>
                          <RequiredField>Telefone do responsável</RequiredField>
                          <FormControl>
                            <MaskedInput
                              mask={['(', /[1-9]/, /\d/, ')', ' ', /\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]}
                              placeholder="Digite o telefone do responsável"
                              className="input-style"
                              {...field}
                            />
                          </FormControl>
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
                      <RequiredField>Gênero do paciente</RequiredField>
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
              <div className="grid gap-x-8 gap-y-4 md:grid-cols-2 mb-4 items-start sm:justify-center">
                <div>
                  <label className="text-sm">Histórico de doenças</label>
                  <div className="space-y-2">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="w-full bg-orange-100 h-full justify-start mt-1 hover:bg-orange-400/10 whitespace-normal gap-4">
                          {selectedDiseases.length > 0 ? (
                            <p className="gap-y-3 items-center flex flex-wrap">
                              {selectedDiseases.map((disease) => (
                                <span 
                                  key={disease} 
                                  className="mr-2 bg-orange-200 rounded-xl p-1 px-2 capitalize"
                                >
                                  {disease === "none" ? "Nenhuma" : disease.replace(/_/g, ' ')}
                                </span>
                              ))}
                            </p>
                          ) : (
                            <p className="text-muted-foreground">
                              Selecione as doenças
                            </p>
                          )}
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-56 self-start">
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
                      <div className="flex gap-2 mt-2">
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

                    {selectedDiseases
                      .filter(disease => !lookupValues.diseases?.some(d => d.label === disease))
                      .length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        <p className="text-sm w-full">Doenças adicionais:</p>
                        {selectedDiseases
                          .filter(disease => !lookupValues.diseases?.some(d => d.label === disease))
                          .map((disease) => (
                            <span 
                              key={disease}
                              className="bg-orange-200 text-sm rounded-xl p-1 px-2 capitalize flex items-center gap-2"
                            >
                              {disease.replace(/_/g, ' ')}
                              <button
                                onClick={() => setSelectedDiseases(prev => prev.filter(d => d !== disease))}
                                className="hover:text-red-500 text-gray-500"
                              >
                                ×
                              </button>
                            </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="text-sm">Histórico de doenças na família</label>
                  <div className="space-y-2">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="w-full bg-orange-100 h-full justify-start mt-1 hover:bg-orange-400/10 whitespace-normal gap-4">
                          {selectedFamilyDiseases.length > 0 ? (
                            selectedFamilyDiseases[0].disease === "Nenhuma" ? (
                              <span className="text-muted-foreground">Nenhuma</span>
                            ) : (
                              <p className="gap-y-3 items-center flex flex-wrap">
                                {selectedFamilyDiseases.map((item) => (
                                  <span 
                                    key={item.disease} 
                                    className="mr-2 bg-orange-200 rounded-xl p-1 px-2 capitalize"
                                  >
                                    {item.disease.replace(/_/g, ' ')}
                                  </span>
                                ))}
                              </p>
                            )
                          ) : (
                            <p className="text-muted-foreground">
                              Selecione as doenças na família
                            </p>
                          )}
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-56 self-start">
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

                    {showOtherFamilyDiseaseInput && (
                      <div className="flex gap-2 mt-2">
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

                    {selectedFamilyDiseases
                      .filter(item => !lookupValues.diseases?.some(d => d.label === item.disease))
                      .length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        <p className="text-sm w-full">Doenças adicionais:</p>
                        {selectedFamilyDiseases
                          .filter(item => !lookupValues.diseases?.some(d => d.label === item.disease))
                          .map((item) => (
                            <span 
                              key={item.disease}
                              className="bg-orange-200 text-sm rounded-xl p-1 px-2 capitalize flex items-center gap-2"
                            >
                              {item.disease.replace(/_/g, ' ')}
                              <button
                                onClick={() => setSelectedFamilyDiseases(prev => 
                                  prev.filter(d => d.disease !== item.disease)
                                )}
                                className="hover:text-red-500 text-gray-500"
                              >
                                ×
                              </button>
                            </span>
                        ))}
                      </div>
                    )}

                    {selectedFamilyDiseases.length > 0 && 
                     selectedFamilyDiseases[0].disease !== "Nenhuma" && (
                      <div className="space-y-2 mt-2">
                        {selectedFamilyDiseases.map((item, index) => (
                          <div key={index} className="flex gap-2 items-center">
                            <span className="min-w-[120px] capitalize">{item.disease.replace(/_/g, ' ')}:</span>
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
                  </FormItem>
                )}
              />
              <FormErrors />
              <div className="col-span-2 flex justify-between mt-8">
                <Button type="button" onClick={handleBack}>
                  Voltar
                </Button>
                <Button 
                  type="submit"
                  disabled={isSaving}
                  className="flex items-center gap-2"
                >
                  {isSaving ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      Salvando...
                    </>
                  ) : (
                    'Salvar'
                  )}
                </Button>
              </div>
            </TabsContent>
          </form>
        </Form>
      </Tabs >
    </div >
  );
}