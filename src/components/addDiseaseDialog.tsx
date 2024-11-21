"use client";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PlusIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabaseClient";
import { formatDate } from "@/i18n/formatDate";
import ReadOnlyNote from "./tiptap/ReadOnlyNote";
import { PatientNote } from "@/types/patientNotes";

interface AddDiseaseDialogProps {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  patientId: string;
  decryptedNotes: PatientNote[];
  onDiseaseAdded: () => void;
}

const AddDiseaseDialog = ({ isOpen, setIsOpen, patientId, decryptedNotes, onDiseaseAdded }: AddDiseaseDialogProps) => {
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);
  const [newDisease, setNewDisease] = useState('');
  const [searchNote, setSearchNote] = useState('');

  const handleAddDisease = async () => {
    try {
      if (!newDisease.trim()) {
        toast.error('Digite o nome da doença');
        return;
      }
      
      if (!selectedNoteId) {
        toast.error('Selecione um relato para vincular');
        return;
      }

      const { error } = await supabase
        .from('diseases')
        .insert({
          disease: newDisease.trim(),
          patient_id: patientId,
          note_id: selectedNoteId
        });
        
      if (error) throw error;
      
      toast.success('Doença adicionada com sucesso');
      setIsOpen(false);
      setNewDisease('');
      setSelectedNoteId(null);
      onDiseaseAdded();
      
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
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
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
              <Input
                id="disease"
                value={newDisease}
                onChange={(e) => setNewDisease(e.target.value)}
                className="col-span-3"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4 mb-4">
              <Label className="text-right">
                Procurar por relatos
              </Label>
              <div className="col-span-3 space-y-4">
                <div className="relative">
                  <Input
                    type="text"
                    value={searchNote}
                    onChange={(e) => setSearchNote(e.target.value)}
                    placeholder="Pesquisar em todos os relatos..."
                    className="w-full h-10 px-3 py-2 text-sm"
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
                    selectedNoteId === note.note_id ? 'border-orange-500 bg-orange-50' : 'border-foreground/20'
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
            disabled={!newDisease.trim() || !selectedNoteId || decryptedNotes.length === 0}
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