"use client";

import { Button } from "@/components/ui/button";
import { useFormatter } from "next-intl";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlusIcon } from "@heroicons/react/24/outline";
import { ArrowTopLeftIcon } from "@radix-ui/react-icons";
import { CheckIcon, XIcon } from "lucide-react";
import Link from "next/link";
import { PatientData } from "@/types/patientData";
import {
  deleteNoteById,
  fetchPatientById,
  fetchPatientNotes,
} from "@/services/patientService";
import { useEffect, useState } from "react";
import { PatientNote } from "@/types/patientNotes";
import PatientNoteItem from "@/components/patientNoteItem";
import { toast } from 'sonner';
import { Empty_Notes } from "../../../../public/images";
import Image from "next/image";
import SearchBar from "@/components/SearchBar";

const PatientSummaries = ({ params }: { params: { patient_id: string } }) => {
  const format = useFormatter();
  const [patientData, setPatientData] = useState<PatientData | null>(null);
  const [patientNotes, setPatientNotes] = useState<PatientNote[]>([]);
  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const successMessage = localStorage.getItem('successMessage');
    if (successMessage) {
      toast.success(successMessage);
      localStorage.removeItem('successMessage');
    }
  }, []);

  // Pegar dados do paciente
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
  }, [params.patient_id, patientNotes]);

  // Pegar todas as notas do paciente
  useEffect(() => {
    const getPatientNotes = async () => {
      const data = await fetchPatientNotes(params.patient_id);
      setPatientNotes(data);
    }
    getPatientNotes();
  }, [params.patient_id]);

  if (loading) return
  <div className="flex justify-center items-center h-screen">
    <div className="flex flex-col gap-4">
      <div className="flex justify-center items-center">
        <div className="w-16 h-16 border-t-2 border-orange-400 border-solid rounded-full animate-spin"></div>
      </div>
      <p className="text-center text-orange-400 text-xl font-medium">Carregando...</p>
    </div>
  </div>
  if (error) return <>
    <div className="flex justify-center items-center h-screen">
      <p className="text-center text-orange-400 text-xl font-medium">Error: {error}</p>
    </div>
  </>;
  if (!patientData) return <>
    <div className="flex justify-center items-center h-screen">
      <p className="text-center text-orange-400 text-xl font-medium">No patient data found</p>
    </div>
  </>;

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

  const handleDeleteNote = async (noteId: string) => {
    try {
      await deleteNoteById(noteId);
      setPatientNotes((prevNotes) => prevNotes.filter(note => note.note_id !== noteId));
      toast.success('Nota excluída com sucesso');
    } catch (err) {
      toast.error('Erro ao excluir a nota: ' + err);
    }
  };

  const filteredNotes = patientNotes.filter((item) =>
    item.note.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container mx-auto flex lg:flex-row flex-col gap-10 mt-10 mb-32">
      {/* Lado esquerdo */}
      <div className="flex relative flex-col h-fit bg-white p-8 space-y-4 rounded-3xl shadow-lg overflow-hidden w-full lg:w-96">
        <Link
          href="/all-patients"
          className="flex items-center gap-1 hover:gap-3 transition-all"
        >
          <ArrowTopLeftIcon className="w-4 h-4" />
          Voltar
        </Link>
        <div>
          <h1 className="text-2xl font-bold capitalize">{patient_name}</h1>
          <p className="text-sm text-gray-500">
            Tipo de paciente: <span className="capitalize">{patient_type}</span>
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-1 gap-4">
          <div className="flex flex-col">
            <span className=" text-orange-400">Histórico de doenças</span>
            <div className="flex gap-2 gap-y-3 mt-2 flex-wrap w-full">
              {diseases_history ? (
                diseases_history.split(",").map((disease, index) => (
                  <p
                    key={index}
                    className="text-sm px-3 py-1 break-all rounded-xl bg-orange-50 border border-orange-300 text-orange-300"
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
            <p className="text-sm text-gray-500 capitalize">{session_day}</p>
          </div>
          <div className="flex flex-col">
            <span className="text-orange-400">Idade</span>
            <p className="text-sm text-gray-500 ca">
              {new Date().getFullYear() - new Date(birthdate).getFullYear()} anos
            </p>
          </div>
          {patient_type === "Criança" && (
            <div className="flex flex-col space-y-4">
              <div>
                <span className="text-orange-400">Nome do responsável</span>
                <p className="text-sm text-gray-500">{guardian_name}</p>
              </div>
              <div className="gap-4">
                <span className="text-orange-400">Telefone do responsável</span>
                {guardian_phone_number ? (
                  <p className="text-sm text-gray-500">{guardian_phone_number}</p>
                ) : (
                  <p className="text-sm text-gray-500">Sem telefone cadastrado</p>
                )}
              </div>
            </div>
          )}
          {patient_type !== "Criança" && (
            <>
              <div className="flex flex-col">
                <span className="text-orange-400">Telefone</span>
                <p className="text-sm text-gray-500">{phone_number}</p>
              </div>
              <div className="flex flex-col">
                <span className="text-orange-400">Estado civil</span>
                <p className="text-sm text-gray-500 capitalize">{marital_status}</p>
              </div>
            </>
          )}
          <div className="flex flex-col">
            <span className="text-orange-400">Tipo de pagamento</span>
            <p className="text-sm text-gray-500 capitalize">{payment_type}</p>
          </div>
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


          <div className="flex flex-col gap-8 w-full overflow-y-auto hide-scrollbar">
            <Tabs defaultValue="notes" className="w-full">
              <div className="flex justify-between items-center mb-6">
                <TabsList>
                  <TabsTrigger value="notes">Notas da Sessão</TabsTrigger>
                  <TabsTrigger value="notes_summary">Resumo de notas (IA)</TabsTrigger>
                </TabsList>
                <Link href={`/add-note/${patientData.patient_id}`}>
                  <Button variant="outline" className="bg-transparent flex items-center justify-center hover:bg-orange-400/20">
                    <PlusIcon className="w-4 h-4 text-orange-400 gap-2" />
                    <p className="text-orange-400 font-medium">Adicionar uma nova nota</p>
                  </Button>
                </Link>
              </div>
              {patientNotes.length === 0 ? (
                <TabsContent value="notes" className="w-full flex flex-col mx-auto items-center space-y-8">
                  <div className="flex flex-col mt-20 w-full justify-center items-center overflow-y-auto hide-scrollbar">
                    <Image src={Empty_Notes} alt="Empty Notes" className="w-72 h-72" />
                    <h2 className="text-foreground text-xl mt-4 font-medium">Nenhuma nota adicionada</h2>
                    <p className="text-foreground text-sm mt-2 font-normal">Adicione uma nota clicando no botão acima para começar a registrar os dados da sessão</p>
                  </div>
                </TabsContent>
              ) : (
                <>
                  <TabsContent value="notes" className="w-full flex flex-col mx-auto items-center space-y-8">
                    <SearchBar search={search} setSearch={setSearch} placeholder="Pesquisar por qualquer palavra" />
                    {filteredNotes.length > 0 ? (filteredNotes.map((note) => (
                      <PatientNoteItem search={search} key={note.note_id} note={note} onDelete={handleDeleteNote} />
                    ))) : (
                      <div className="col-span-full text-center text-gray-500 text-xl break-all">
                        Nenhuma nota corresponde com o texto: "{search}".
                      </div>
                    )}
                  </TabsContent>
                </>
              )}
              <TabsContent value="notes_summary"><p className="font-medium text-center text-xl">Resumos de IA ficarão por aqui. (Parte 2 do projeto)</p></TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientSummaries;
