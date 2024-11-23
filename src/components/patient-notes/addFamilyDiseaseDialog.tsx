"use client";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeftStartOnRectangleIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabaseClient";
import { useLookupValues } from "@/hooks/useLookupValues";

interface AddFamilyDiseaseDialogProps {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  patientId: string;
}

const AddFamilyDiseaseDialog = ({ isOpen, setIsOpen, patientId }: AddFamilyDiseaseDialogProps) => {
  const [selectedDisease, setSelectedDisease] = useState('');
  const [relationship, setRelationship] = useState('');
  const [showOtherDiseaseInput, setShowOtherDiseaseInput] = useState(false);
  const [otherDisease, setOtherDisease] = useState('');
  const { lookupValues } = useLookupValues();

  const handleDiseaseChange = (value: string) => {
    if (value === "other") {
      setShowOtherDiseaseInput(true);
      setSelectedDisease('');
      return;
    }
    setShowOtherDiseaseInput(false);
    setSelectedDisease(value);
  };

  const handleAddDisease = async () => {
    try {
      const diseaseToAdd = showOtherDiseaseInput ? otherDisease : selectedDisease;

      if (!diseaseToAdd.trim()) {
        toast.error('Selecione ou digite uma doença');
        return;
      }
      
      if (!relationship.trim()) {
        toast.error('Digite o parentesco');
        return;
      }

      const { error } = await supabase
        .from('family_diseases')
        .insert({
          disease: diseaseToAdd.trim(),
          relationship: relationship.trim(),
          patient_id: patientId,
          created_at: new Date()
        });
        
      if (error) throw error;
      
      toast.success('Doença familiar adicionada com sucesso');
      setIsOpen(false);
      setSelectedDisease('');
      setRelationship('');
      setOtherDisease('');
      setShowOtherDiseaseInput(false);
        
    } catch (error) {
      toast.error('Erro ao adicionar doença familiar');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
          <span className="cursor-pointer w-full flex items-center gap-2">
            <ArrowLeftStartOnRectangleIcon className="w-5 h-5" />
            Doença psicológica de um familiar
          </span>
        </DropdownMenuItem>
      </DialogTrigger>
      <DialogContent className="w-11/12 sm:max-w-2xl">
        <DialogHeader className="mt-8">
          <DialogTitle>Adicionar doença psicológica familiar</DialogTitle>
          <DialogDescription>
            Adicione uma doença psicológica de um familiar do paciente.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          <div className="space-y-2">
            <Label>Selecione a doença</Label>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full bg-orange-100 h-10 justify-start hover:bg-orange-400/10 whitespace-normal gap-4">
                  {selectedDisease || (showOtherDiseaseInput ? "Outra doença" : "Selecione uma doença")}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="sm:w-96 overflow-y-auto max-h-96">
                <DropdownMenuLabel>Doenças Psicológicas</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {lookupValues.diseases?.map((disease) => (
                  <DropdownMenuCheckboxItem
                    key={disease.value}
                    checked={selectedDisease === disease.label}
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
              <Input
                value={otherDisease}
                onChange={(e) => setOtherDisease(e.target.value)}
                placeholder="Digite o nome da doença"
                className="mt-2"
              />
            )}
          </div>

          <div className="space-y-2">
            <Label>Parentesco</Label>
            <Input
              value={relationship}
              onChange={(e) => setRelationship(e.target.value)}
              placeholder="Ex: Mãe, Pai, Irmão..."
            />
          </div>
        </div>

        <DialogFooter>
          <Button 
            type="submit" 
            disabled={(!selectedDisease && !otherDisease) || !relationship.trim()}
            onClick={handleAddDisease}
          >
            Adicionar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddFamilyDiseaseDialog;