import { PatientNote } from "@/types/patientNotes";
import { useFormatter } from "next-intl";
import { useState } from "react";
import { CalendarIcon, PlusIcon, Cog6ToothIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible";
import { SizeIcon } from "@radix-ui/react-icons";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import ReadOnlyNote from "./tiptap/ReadOnlyNote";

const PatientNoteItem = ({ note, onDelete }: { note: PatientNote, onDelete: (note_id: string) => void }) => {
  const format = useFormatter();
  const formatDate = (date: Date) =>
    format.dateTime(date, {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  const [openNotes, setOpenNotes] = useState<{ [key: string]: boolean }>({});

  const toggleNote = (noteId: string) => {
    setOpenNotes((prev) => ({
      ...prev,
      [noteId]: !prev[noteId],
    }));
  };
  return (
    <div className="flex flex-col bg-[#FCF6F7] border border-[#E6E6E6] p-8 px-12 rounded-3xl w-full">
      <div className="flex justify-between border-b border-orange-200 pb-4">
        <h1 className="text-orange-900 text-xl font-medium">Resumo de sessão</h1>
        <div className="flex items-center gap-2 text-orange-400">
          <CalendarIcon className="w-4 h-4 " />
          <div className="flex items-center gap-4">
            <p>{formatDate(new Date(note.note_date))}</p>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Cog6ToothIcon className="w-4 h-4" />

              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  Editar
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => {
                  onDelete(note.note_id);
                }}>
                  Excluir
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
      <Collapsible defaultOpen={false} className="pt-4">
        <CollapsibleTrigger onClick={() => toggleNote(note.note_id)} className="flex items-center gap-2 text-orange-400">
          {openNotes[note.note_id] ? (<><SizeIcon className="w-4 h-4" /> <p>Fechar</p></>) : (<><PlusIcon className="w-4 h-4" /> <p>Abrir</p></>)}
        </CollapsibleTrigger>
        {openNotes[note.note_id] && (
          <CollapsibleContent>

            <ReadOnlyNote content={note.note} />

            {note.image_url && (
              <Image src={note.image_url} alt="session" width={1000} height={1000} className="mt-8 border border-stroke rounded-xl" />
            )}
          </CollapsibleContent>
        )}
      </Collapsible>
    </div>
  )
}

export default PatientNoteItem;