import { PatientNote } from "@/types/patientNotes";
import AddDiseaseDialog from "./addDiseaseDialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import AddFamilyDiseaseDialog from "./addFamilyDiseaseDialog";
import { useState } from "react";

interface AddDiseaseProps {
    patientId: string;
    decryptedNotes: PatientNote[];
}

const AddDiseaseButton = ({ patientId, decryptedNotes }: AddDiseaseProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isOpenFamilyDisease, setIsOpenFamilyDisease] = useState(false);

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger>
                    <Button variant="outline" className="text-orange-400 w-full whitespace-normal">
                        Adicionar uma nova doença
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <AddDiseaseDialog
                        isOpen={isOpen}
                        setIsOpen={setIsOpen}
                        patientId={patientId}
                        decryptedNotes={decryptedNotes}
                    />
                    <AddFamilyDiseaseDialog
                        isOpen={isOpenFamilyDisease}
                        setIsOpen={setIsOpenFamilyDisease}
                        patientId={patientId}
                    />
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    )
}

export default AddDiseaseButton;