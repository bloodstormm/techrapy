"use client";

import { Button } from "@/components/ui/button";
import { useFormatter } from "next-intl";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarIcon, PlusIcon } from "@heroicons/react/24/outline";
import { ArrowTopLeftIcon, SizeIcon } from "@radix-ui/react-icons";
import { CheckIcon, XIcon } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { PatientData } from "@/types/patientData";

import {
  fetchPatientById,
  fetchPatientNotes,
} from "@/services/patientService";
import { useEffect, useState } from "react";
import { PatientNote } from "@/types/patientNotes";

const PatientSummaries = ({ params }: { params: { patient_id: string } }) => {
  const format = useFormatter();
  const [patientData, setPatientData] = useState<PatientData | null>(null);
  const [patientNotes, setPatientNotes] = useState<PatientNote[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    const getPatientData = async () => {
      try {
        const data = await fetchPatientById(params.patient_id);
        setPatientData(data);
      } catch (err) {
        setError(err as string);
      } finally {
        setLoading(false);
      }
    };

    getPatientData();
  }, [params.patient_id]);

  useEffect(() => {
    const getPatientNotes = async () => {
      const data = await fetchPatientNotes(params.patient_id);
      setPatientNotes(data);

      // Inicializa todas as notas como fechadas
      const initialOpenNotes = data.reduce((acc, note) => {
        acc[note.id] = false;
        return acc;
      }, {} as { [key: string]: boolean });
      setOpenNotes(initialOpenNotes);
    };

    getPatientNotes();
  }, [params.patient_id]);

  const [openNotes, setOpenNotes] = useState<{ [key: string]: boolean }>({});

  const toggleNote = (noteId: string) => {
    setOpenNotes((prev) => ({
      ...prev,
      [noteId]: !prev[noteId],
    }));
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!patientData) return <p>No patient data found</p>;

  const {
    patient_name,
    patient_type,
    diseases_history,
    session_day,
    birthdate,
    phone_number,
    marital_status,
    payment_type,
    guardian_phone_number,
    guardian_name,
  } = patientData;

  const formatDate = (date: Date) =>
    format.dateTime(date, {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

  return (
    <div className="container mx-auto flex gap-10 mt-10 mb-32">
      {/* Lado esquerdo */}
      <div className="flex relative flex-col h-fit bg-white p-8 space-y-4 rounded-3xl shadow-lg overflow-hidden w-96">
        <Link
          href="/all-users"
          className="flex items-center gap-1 hover:gap-3 transition-all"
        >
          <ArrowTopLeftIcon className="w-4 h-4" />
          Voltar
        </Link>
        <div>
          <h2 className="text-2xl font-bold capitalize">{patient_name}</h2>
          <p className="text-sm text-gray-500">
            Tipo de paciente: <span className="capitalize">{patient_type}</span>
          </p>
        </div>

        <div className="flex flex-col">
          <span className=" text-orange-400">Histórico de doenças</span>
          <div className="flex gap-2 gap-y-3 mt-2 flex-wrap">
            {diseases_history ? (
              diseases_history.split(",").map((disease, index) => (
                <p
                  key={index}
                  className="text-sm px-3 py-1 rounded-full bg-orange-50 border border-orange-300 text-orange-300"
                >
                  {disease.trim()}
                </p>
              ))
            ) : (
              <p className="text-sm text-gray-500">
                Não há histórico de doenças
              </p>
            )}
          </div>
        </div>
        <div className="flex flex-col">
          <span className="text-orange-400">Dia da consulta</span>
          <p className="text-sm text-gray-500">{session_day}</p>
        </div>
        <div className="flex flex-col">
          <span className="text-orange-400">Idade</span>
          <p className="text-sm text-gray-500">
            {new Date().getFullYear() - new Date(birthdate).getFullYear()} anos
          </p>
        </div>
        {patient_type === "criança" && (
          <div className="flex flex-col space-y-2">
            <span className="text-orange-400">Nome do responsável</span>
            <p className="text-sm text-gray-500">{guardian_name}</p>
            <span className="text-orange-400">Telefone do responsável</span>
            {guardian_phone_number ? (
              <p className="text-sm text-gray-500">{guardian_phone_number}</p>
            ) : (
              <p className="text-sm text-gray-500">Sem telefone cadastrado</p>
            )}
          </div>
        )}
        {patient_type !== "criança" && (
          <div className="flex flex-col">
            <span className="text-orange-400">Telefone</span>
            <p className="text-sm text-gray-500">{phone_number}</p>
          </div>
        )}
        <div className="flex flex-col">
          <span className="text-orange-400">Estado civil</span>
          <p className="text-sm text-gray-500">{marital_status}</p>
        </div>
        <div className="flex flex-col">
          <span className="text-orange-400">Tipo de pagamento</span>
          <p className="text-sm text-gray-500">{payment_type}</p>
        </div>
        <Separator className="bg-orange-200" />
        <div className="flex flex-col">
          <span className="text-orange-400">
            Presença nas últimas 3 consultas
          </span>
          <div className="flex gap-2 items-center">
            <CheckIcon className="w-4 h-4 text-green-500" />
            <p className="text-sm text-gray-500">Presente - 20/05/2024</p>
          </div>
          <div className="flex gap-2 items-center">
            <CheckIcon className="w-4 h-4 text-green-500" />
            <p className="text-sm text-gray-500">Presente - 13/05/2024</p>
          </div>
          <div className="flex gap-2 items-center">
            <XIcon className="w-4 h-4 text-red-500" />
            <p className="text-sm text-gray-500">Não atendido - 06/05/2024</p>
          </div>
        </div>
      </div>
      {/* Lado direito */}
      <div className="flex flex-col w-full">
        <p className="text-orange-400 text-xl font-medium mb-6">Sessões do paciente</p>
        <div className="flex flex-col gap-6">

          {/* Lado direito */}
          <div className="flex flex-col gap-8 w-full overflow-y-auto hide-scrollbar">
            <Tabs defaultValue="notes" className="w-full">
              <div className="flex justify-between items-center mb-6">
                <TabsList>
                  <TabsTrigger value="notes">Notas da Sessão</TabsTrigger>
                  <TabsTrigger value="notes_summary">Resumo de notas (IA)</TabsTrigger>
                </TabsList>
                <Link href={`/add-note/${patient_name}`}>
                  <Button variant="outline" className="bg-transparent flex items-center justify-center hover:bg-orange-400/20">
                    <PlusIcon className="w-4 h-4 text-orange-400 gap-2" />
                    <p className="text-orange-400 font-medium">Adicionar uma nova nota</p>
                  </Button>
                </Link>
              </div>
              <TabsContent value="notes" className="w-full flex flex-col mx-auto items-center space-y-8">
                {patientNotes.map((note) => (
                  <div className="flex flex-col bg-[#FCF6F7] border border-[#E6E6E6] p-8 px-12 rounded-3xl w-full">
                    <div className="flex justify-between border-b border-orange-200 pb-4">
                      <h1 className="text-orange-900 text-xl font-medium">Resumo de sessão</h1>
                      <div className="flex items-center gap-2 text-orange-400">
                        <CalendarIcon className="w-4 h-4 " />
                        <p>{formatDate(new Date(note.note_date))}</p>
                      </div>
                    </div>
                    <Collapsible defaultOpen={false} className="pt-4">
                      <CollapsibleTrigger onClick={() => toggleNote(note.note_id)} className="flex items-center gap-2 text-orange-400">
                        {openNotes[note.note_id] ? (<><SizeIcon className="w-4 h-4" /> <p>Fechar</p></>) : (<><PlusIcon className="w-4 h-4" /> <p>Abrir</p></>)}
                      </CollapsibleTrigger>
                      {openNotes[note.note_id] && (
                        <CollapsibleContent>
                          <p className="mt-6">{note.note}</p>

                          {note.image_url && (  
                            <Image src={note.image_url} alt="session" width={1000} height={1000} className="mt-8 border border-stroke rounded-xl" />
                          )}
                        </CollapsibleContent>
                      )}
                    </Collapsible>
                  </div>
                ))}
              </TabsContent>
              <TabsContent value="notes_summary"><p className="font-medium text-center text-xl">Resumos de IA ficarão por aqui. (Parte 2 do projeto)</p></TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientSummaries;
