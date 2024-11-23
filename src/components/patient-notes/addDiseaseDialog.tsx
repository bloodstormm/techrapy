"use client";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DropdownMenuItem, DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PlusIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabaseClient";
import { formatDate } from "@/i18n/formatDate";
import ReadOnlyNote from "../tiptap/ReadOnlyNote";
import { PatientNote } from "@/types/patientNotes";
import { useLookupValues } from "@/hooks/useLookupValues";

interface AddDiseaseDialogProps {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  patientId: string;
  decryptedNotes: PatientNote[];
  onDiseaseAdded?: () => void;
}

const AddDiseaseDialog = ({ isOpen, setIsOpen, patientId, decryptedNotes, onDiseaseAdded }: AddDiseaseDialogProps) => {
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);
  const [selectedDisease, setSelectedDisease] = useState('');
  const [showOtherDiseaseInput, setShowOtherDiseaseInput] = useState(false);
  const [otherDisease, setOtherDisease] = useState('');
  const [searchNote, setSearchNote] = useState('');
  const { lookupValues } = useLookupValues();

  const handleDiseaseChange = (disease: string) => {
    if (disease === "other") {
      setShowOtherDiseaseInput(!showOtherDiseaseInput);
      setSelectedDisease('');
    } else {
      setSelectedDisease(disease);
      setShowOtherDiseaseInput(false);
      setOtherDisease('');
    }
  };

  const handleAddDisease = async () => {
    try {
      const finalDisease = showOtherDiseaseInput ? otherDisease.trim() : selectedDisease;

      if (!finalDisease) {
        toast.error('Digite ou selecione o nome da doença');
        return;
      }
      
      if (!selectedNoteId) {
        toast.error('Selecione um relato para vincular');
        return;
      }

      const { data, error } = await supabase
        .from('diseases')
        .insert({
          disease: finalDisease,
          patient_id: patientId,
          note_id: selectedNoteId
        })
        .select()
        .single();
        
      if (error) throw error;
      
      onDiseaseAdded?.();
      
      toast.success('Doença adicionada com sucesso');
      setIsOpen(false);
      setSelectedDisease('');
      setOtherDisease('');
      setSelectedNoteId(null);
      setShowOtherDiseaseInput(false);
    } catch (error) {
      toast.error('Erro ao adicionar doença');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
          <span className="cursor-pointer w-full flex items-center gap-2">
            <PlusIcon className="w-5 h-5" />
            Doença do paciente
          </span>
        </DropdownMenuItem>
      </DialogTrigger>
      <DialogContent className="w-11/12 sm:max-w-2xl">
        <DialogHeader className="mt-8 ">
          <DialogTitle>Adicionar uma nova doença</DialogTitle>
          <DialogDescription>
            Adicione uma nova doença ao paciente e vincule a um relato de sessão.
          </DialogDescription>
        </DialogHeader>

        {decryptedNotes.length === 0 ? (
          <div className="py-4 text-center text-orange-500">
            Você precisa adicionar um relato de sessão primeiro antes de registrar uma doença.
          </div>
        ) : (
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="disease" className="text-right">
                Nome da doença
              </Label>
              <div className="col-span-3">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="outline" 
                      className="w-full bg-orange-100 h-10 justify-start hover:bg-orange-400/10 whitespace-normal gap-4"
                    >
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
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <div className="col-span-4 space-y-4">
                <div className="relative">
                  <Input
                    type="text"
                    value={searchNote}
                    onChange={(e) => setSearchNote(e.target.value)}
                    placeholder="Pesquisar em todos os relatos..."
                    className="w-full h-10 px-3 mt-3 bg-foreground/5 border border-foreground/20 text-sm"
                  />
                  <MagnifyingGlassIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                </div>
              </div>
            </div>

            <div className="space-y-2 max-h-[300px] overflow-y-auto relative">
              {(searchNote
                ? decryptedNotes.filter(note =>
                  note.decryptedContent?.toLowerCase().includes(searchNote.toLowerCase())
                )
                : decryptedNotes.slice(0, 3)
              ).map((note) => (
                <div
                  key={note.note_id}
                  className={`p-4 rounded-xl cursor-pointer border ${
                    selectedNoteId === note.note_id ? 'border-orange-500 bg-orange-50 dark:bg-zinc-900' : 'border-foreground/20'
                  }`}
                  onClick={() => setSelectedNoteId(note.note_id)}
                >
                  <p className="text-sm font-medium">{formatDate(new Date(note.note_date))}</p>
                  <p className="text-sm truncate line-clamp-3">
                    <ReadOnlyNote content={note.decryptedContent || ''} />
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        <DialogFooter>
          <Button 
            type="submit" 
            disabled={!selectedDisease && !showOtherDiseaseInput || !selectedNoteId || decryptedNotes.length === 0}
            onClick={handleAddDisease}
          >
            Adicionar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddDiseaseDialog;