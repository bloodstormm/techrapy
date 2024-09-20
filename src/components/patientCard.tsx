import {
    SparklesIcon, DocumentIcon, CalendarIcon, PlusIcon
} from "@heroicons/react/24/outline";
import { Button } from "./ui/button";
import { NoSession } from "../../public/images";
import Image from "next/image";
import { PatientData } from "@/types/patientData";
import Link from "next/link";

interface PatientCardProps {
    patientData: PatientData;
    lastSession: string;
}

const PatientCard = ({patientData, lastSession}: PatientCardProps) => {
    return (
        <div className="bg-white/20 backdrop-blur-lg p-4 rounded-xl w-full border border-[#472417]/30">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-lg font-medium">Patient Name</h1>
                <p className="text-sm text-gray-500">Patient ID</p>
            </div>
            {lastSession ? (
            <div className="flex p-4 rounded-xl bg-white/20 backdrop-blur-lg items-center">
                <p className="text-sm line-clamp-2"><b>Última resumo: </b> {lastSession}</p>
            </div>
            ) : (
                <div className="w-full border-b flex flex-col items-center border-orange-900/20 my-4 pb-4">
                    <Image src={NoSession} alt="No session" className="w-20 h-20" />
                    <p className="text-sm"><b>No last session summary</b></p>
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
                        <p className="text-sm"><b>1</b></p>
                    </div>
                    <div className="flex items-center gap-2">
                        <SparklesIcon className="w-4 h-4" />
                        <p className="text-sm"><b>4</b></p>
                    </div>
                </div>
            </div>

            <div className="flex w-full justify-between items-center gap-4 my-4">
                <Button variant="outline" className="bg-transparent w-full hover:bg-orange-400/20">
                    <PlusIcon className="w-4 h-4 text-orange-400 gap-2" />
                    <p className="text-orange-400 font-medium">Adicionar nota</p>
                </Button>
                <Link href={`/patient-summaries/${patientData.patientName}`}>
                    <Button className="w-full hover:bg-orange-500 gap-2">
                        <DocumentIcon className="w-4 h-4" />
                    <p className="font-medium">Ver resumos</p>
                </Button>
                </Link>
            </div>
        </div>
    )
}

export default PatientCard;