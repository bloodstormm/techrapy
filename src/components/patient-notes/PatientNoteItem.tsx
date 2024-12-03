import { PatientNote } from "@/types/patientNotes";
import { formatDate } from "@/i18n/formatDate";
import { useState, useEffect } from "react";
import {
  CalendarIcon,
  PlusIcon,
  Cog6ToothIcon,
} from "@heroicons/react/24/outline";
import Image from "next/image";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/components/ui/collapsible";
import { SizeIcon } from "@radix-ui/react-icons";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import ReadOnlyNote from "../tiptap/ReadOnlyNote";
import { decryptText } from '@/lib/encryption';
import Link from "next/link";

const highlightText = (text: string, search: string) => {
  if (!search) return text;
  const regex = new RegExp(`(${search})`, "gi");
  return text.replace(regex, '<mark>$1</mark>');
};

const NoteHeader = ({
  noteDate,
  onDelete,
  noteId,
  diseases,
}: {
  noteDate: string;
  onDelete: (note_id: string) => void;
  noteId: string;
  diseases?: string[];
}) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 sm:gap-0 justify-between border-b border-orange-200 pb-4">
      <div className="flex flex-wrap items-center gap-2">
        <h1 className="text-orange-900 dark:text-orange-400 text-xl font-medium">Resumo de sessão</h1>
        {diseases && diseases.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {diseases.map((disease, index) => (
              <span 
                key={index}
                className="px-2 py-1 text-sm rounded-full bg-orange-100 dark:bg-orange-900 text-orange-600 dark:text-foreground"
              >
                {disease}
              </span>
            ))}
          </div>
        )}
      </div>
      <div className="flex justify-between sm:justify-start items-center gap-3 text-orange-400">
        <div className="flex items-center gap-2">
          <CalendarIcon className="w-4 h-4 " />
          <p className="whitespace-nowrap">{formatDate(new Date(noteDate))}</p>

        </div>
        <div className="flex items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Cog6ToothIcon className="w-4 h-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href={`/edit-note/${noteId}`} className="cursor-pointer">
                  Editar
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDelete(noteId)}>
                Excluir
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
};

const NoteContent = ({
  note,
  search,
}: {
  note: PatientNote;
  search: string;
}) => {
  const decryptedNote = decryptText(note.note);

  const [openNotes, setOpenNotes] = useState<{ [key: string]: boolean }>({});

  const toggleNote = (noteId: string) => {
    setOpenNotes((prev) => ({
      ...prev,
      [noteId]: !prev[noteId],
    }));
  };
  console.log(note.image_url)

  return (
    <Collapsible defaultOpen={false} className="pt-4">
      <div className="flex items-center justify-between">
        <CollapsibleTrigger
          onClick={() => toggleNote(note.note_id)}
          className="flex items-center gap-2 text-orange-400"
        >
          {openNotes[note.note_id] ? (
            <>
              <SizeIcon className="w-4 h-4" /> <p>Fechar</p>
            </>
          ) : (
            <>
              <PlusIcon className="w-4 h-4" /> <p>Ver tudo</p>
            </>
          )}
        </CollapsibleTrigger>
      </div>
      {!openNotes[note.note_id] && (
        <div>
          <ReadOnlyNote
            className="note-preview"
            content={highlightText(decryptedNote, search)}
          />
        </div>
      )}
      <CollapsibleContent>
        <div
          className={`overflow-hidden transition-all duration-300 ${openNotes[note.note_id] ? "max-h-full" : "max-h-20"
            }`}
        >
          <ReadOnlyNote content={highlightText(decryptedNote, search)} />
        </div>
        {note.image_url && (
          <Image
            src={note.image_url}
            alt="session"
            width={1000}
            height={1000}
            placeholder="blur"
            blurDataURL={note.image_url}
            className="mt-8 border border-stroke rounded-xl w-full h-full"
          />
        )}
      </CollapsibleContent>
    </Collapsible>
  );
};

const PatientNoteItem = ({
  note,
  onDelete,
  search,
}: {
  note: PatientNote;
  onDelete: (note_id: string) => void;
  search: string;
}) => {
  return (
    <div className="flex flex-col bg-[#fcf6f3] dark:bg-[#242424] border border-[#E6E6E6] dark:border-foreground/10 p-8 sm:px-12 rounded-3xl w-full break-all">
      <NoteHeader
        noteDate={note.note_date}
        onDelete={onDelete}
        noteId={note.note_id}
        diseases={note.associatedDiseases}
      />
      <NoteContent
        note={{ ...note, note: note.decryptedContent || '' }}
        search={search}
      />
    </div>
  );
};

export default PatientNoteItem;
