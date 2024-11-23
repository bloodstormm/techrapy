"use client"

import {
    DocumentIcon, CalendarIcon, PlusIcon,
    Cog6ToothIcon
} from "@heroicons/react/24/outline";
import { Button } from "./ui/button";
import { No_Session } from "../../public/images";
import Image from "next/image";
import { PatientData } from "@/types/patientData";
import Link from "next/link";
import { PatientNote } from "@/types/patientNotes";
import { useEffect, useState } from "react";
import { fetchLastNote, fetchPatientNotesCount } from "@/services/patientService";
import ReadOnlyNote from "./tiptap/ReadOnlyNote";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem } from "./ui/dropdown-menu";
import { DropdownMenuTrigger } from "./ui/dropdown-menu";
import { decryptText } from '@/lib/encryption';


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
            const lastNote = await fetchLastNote(patientData.patient_id!);
            const patientNotesCount = await fetchPatientNotesCount(patientData.patient_id!);
            lastNote && (lastNote.note = decryptText(lastNote.note));
            setLastNote(lastNote);
            setPatientNotesCount(patientNotesCount);
            setIsLoading(false);
        };
        fetchData();
    }, [patientData.patient_id]);

    const handleDeletePatient = async () => {
        await onDeletePatient(patientData.patient_id!);
    };

    const renderLoadingState = () => (
        <div className="flex items-center justify-center h-28 bg-white/20">
            <p className="text-sm">Carregando último resumo...</p>
        </div>
    );

    const renderLastNote = () => (
        <div className="flex p-4 h-[125px] my-4 flex-col text-sm rounded-xl justify-center bg-orange-300/20 backdrop-blur-lg card-border">
            <p><b>Último resumo: </b></p>
            <ReadOnlyNote content={lastNote!.note} className="note-preview" />
        </div>
    );

    const renderNoNote = () => (
        <div className="w-full border-b flex flex-col items-center border-orange-900/20 my-4 pb-4">
            <Image src={No_Session} alt="No session" className="w-20 h-20 mb-2" priority />
            <p className="text-sm"><b>Nenhum resumo criado</b></p>
        </div>
    );

    return (
        <div className="bg-[#fcf6f3] dark:bg-background backdrop-blur-lg p-4 rounded-xl flex flex-col justify-between w-full border border-[#472417]/30 dark:border-foreground/10">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-lg font-medium capitalize">{patientData.patient_name}</h1>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Cog6ToothIcon className="w-5 h-5 cursor-pointer" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={handleDeletePatient}>
                            Excluir paciente
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
            {isLoading ? renderLoadingState() : lastNote ? renderLastNote() : renderNoNote()}
            <div className="flex justify-between items-center mt-4 mb-2">
                <div className="flex items-center gap-2">
                    <CalendarIcon className="w-4 h-4" />
                    <p className="text-sm capitalize"><b>Consultas: {patientData.session_day}</b></p>
                </div>
                <div className="flex items-center gap-2">
                    <DocumentIcon className="w-4 h-4" />
                    <p className="text-sm"><b>{patientNotesCount}</b></p>
                </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 w-full justify-between items-center gap-4 my-4">
                <Link href={`/add-note/${patientData.patient_id}`}>
                    <Button variant="outline" className="w-full bg-transparent hover:bg-orange-400/20 text-orange-400 hover:text-orange-400 gap-2">
                        <PlusIcon className="w-4 h-4" />
                        <p className="font-medium">Adicionar Relato</p>
                    </Button>
                </Link>
                <Link href={`/patient-notes/${patientData.patient_id}`} className="w-full">
                    <Button className="w-full gap-2">
                        <DocumentIcon className="w-4 h-4" />
                        <p className="font-medium">Ver relatos</p>
                    </Button>
                </Link>
            </div>
        </div>
    )
}

export default PatientCard;