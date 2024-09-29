import {
    SparklesIcon, DocumentIcon, CalendarIcon, PlusIcon
} from "@heroicons/react/24/outline";
import { Button } from "./ui/button";
import { NoSession } from "../../public/images";
import Image from "next/image";
import { PatientData } from "@/types/patientData";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import { PatientNote } from "@/types/patientNotes";
import { useEffect } from "react";
import { fetchLastNote } from "@/services/patientService";

interface PatientCardProps {
    patientData: PatientData;
}

const PatientCard = async ({ patientData }: PatientCardProps) => {
    const lastNote = await fetchLastNote(patientData.patient_id);
    return (
        <div className="bg-white/20 backdrop-blur-lg p-4 rounded-xl w-full border border-[#472417]/30">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-lg font-medium capitalize">{patientData.patient_name}</h1>
                <p className="text-sm text-gray-500">Patient ID</p>
            </div>
            {lastNote ? (
                <div className="flex p-4 rounded-xl bg-white/20 backdrop-blur-lg items-center">
                    <p className="text-sm line-clamp-2 overflow-ellipsis"><b>Último resumo: </b> {lastNote.note}</p>
                </div>
            ) : (
                <div className="w-full border-b flex flex-col items-center border-orange-900/20 my-4 pb-4">
                    <Image src={NoSession} alt="No session" className="w-20 h-20 mb-2" />
                    <p className="text-sm"><b>Não há resumos</b></p>
                </div>
            )}
            <div className="flex justify-between items-center my-5">
                <div className="flex items-center gap-2">
                    <CalendarIcon className="w-4 h-4" />
                    <p className="text-sm"><b>Consultas: Terça Feira</b></p>
                </div>
                <div className="flex items-center gap-2">
                    <div className="flex items-center gap-2">
                        <DocumentIcon className="w-4 h-4" />
                        <p className="text-sm"><b>0</b></p>
                    </div>
                    <div className="flex items-center gap-2">
                        <SparklesIcon className="w-4 h-4" />
                        <p className="text-sm"><b>0</b></p>
                    </div>
                </div>
            </div>

            <div className="flex w-full justify-between items-center gap-4 my-4">
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