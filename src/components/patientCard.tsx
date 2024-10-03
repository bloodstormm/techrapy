"use client"

import {
    SparklesIcon, DocumentIcon, CalendarIcon, PlusIcon,
    Cog6ToothIcon
} from "@heroicons/react/24/outline";
import { Button } from "./ui/button";
import { NoSession } from "../../public/images";
import Image from "next/image";
import { PatientData } from "@/types/patientData";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import { PatientNote } from "@/types/patientNotes";
import { useEffect, useState } from "react";
import { fetchLastNote, fetchPatientNotesCount } from "@/services/patientService";
import ReadOnlyNote from "./tiptap/ReadOnlyNote";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem } from "./ui/dropdown-menu";
import { DropdownMenuTrigger } from "./ui/dropdown-menu";

interface PatientCardProps {
    patientData: PatientData;
    onDeletePatient: (patientId: string) => Promise<void>;
}

const PatientCard = ({ patientData, onDeletePatient }: PatientCardProps) => {
    const [lastNote, setLastNote] = useState<PatientNote | null>(null);
    const [patientNotesCount, setPatientNotesCount] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            const lastNote = await fetchLastNote(patientData.patient_id);
            const patientNotesCount = await fetchPatientNotesCount(patientData.patient_id);
            setLastNote(lastNote);
            setPatientNotesCount(patientNotesCount);
            setIsLoading(false);
        };
        fetchData();
    }, []);

    const handleDeletePatient = async () => {
        await onDeletePatient(patientData.patient_id);
    };

    return (
        <div className="bg-white/20 backdrop-blur-lg p-4 rounded-xl flex flex-col justify-between w-full border border-[#472417]/30">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-lg font-medium capitalize">{patientData.patient_name}</h1>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Cog6ToothIcon className="w-4 h-4 cursor-pointer" />

                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={handleDeletePatient}>
                            Excluir paciente
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
            {isLoading ? (
                <div className="flex items-center justify-center h-28 bg-white/20">
                    <p className="text-sm">Carregando último resumo...</p>
                </div>
            ) : lastNote ? (
                <div className="flex p-4 max-h-28 flex-col text-sm rounded-xl line-clamp-2 overflow-hidden overflow-ellipsis bg-white/20 backdrop-blur-lg card-border">
                    <p><b>Último resumo: </b> </p><ReadOnlyNote className="overflow-hidden h-28 overflow-ellipsis" content={lastNote.note} />
                </div>
            ) : (
                <div className="w-full border-b flex flex-col items-center border-orange-900/20 my-4 pb-4">
                    <Image src={NoSession} alt="No session" className="w-20 h-20 mb-2" priority />
                    <p className="text-sm"><b>Não há resumos</b></p>
                </div>
            )}
            <div className="flex justify-between items-center my-2">
                <div className="flex items-center gap-2">
                    <CalendarIcon className="w-4 h-4" />
                    <p className="text-sm capitalize"><b>Consultas: {patientData.session_day}</b></p>
                </div>
                <div className="flex items-center gap-2">
                    <div className="flex items-center gap-2">
                        <DocumentIcon className="w-4 h-4" />
                        <p className="text-sm"><b>{patientNotesCount}</b></p>
                    </div>
                    <div className="flex items-center gap-2">
                        <SparklesIcon className="w-4 h-4" />
                        <p className="text-sm"><b>0</b></p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 w-full justify-between items-center gap-4 my-4">
                <Link href={`/add-note/${patientData.patient_id}`}>
                    <Button variant="outline" className="w-full bg-transparent hover:bg-orange-400/20 text-orange-400 hover:text-orange-400 gap-2">
                        <PlusIcon className="w-4 h-4" />
                        <p className="font-medium">Adicionar nota</p>
                    </Button>
                </Link>
                <Link href={`/patient-notes/${patientData.patient_id}`} className="w-full">
                    <Button className="w-full gap-2">
                        <DocumentIcon className="w-4 h-4" />
                        <p className="font-medium">Ver resumos</p>
                    </Button>
                </Link>
            </div>
        </div>
    )
}

export default PatientCard;