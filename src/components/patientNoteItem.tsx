import { PatientNote } from "@/types/patientNotes";
import { useFormatter } from "next-intl";
import { useState } from "react";
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
} from "./ui/dropdown-menu";
import ReadOnlyNote from "./tiptap/ReadOnlyNote";

const highlightText = (text: string, search: string) => {
  if (!search) return text;
  const regex = new RegExp(`(${search})`, "gi");
  return text.replace(regex, "<mark>$1</mark>");
};

const formatDate = (date: Date, format: any) =>
  format.dateTime(date, {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

const NoteHeader = ({
  noteDate,
  onDelete,
  noteId,
}: {
  noteDate: string;
  onDelete: (note_id: string) => void;
  noteId: string;
}) => {
  const format = useFormatter();
  return (
    <div className="flex justify-between border-b border-orange-200 pb-4">
      <h1 className="text-orange-900 text-xl font-medium">Resumo de sessão</h1>
      <div className="flex items-center gap-2 text-orange-400">
        <CalendarIcon className="w-4 h-4 " />
        <div className="flex items-center gap-4">
          <p>{formatDate(new Date(noteDate), format)}</p>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Cog6ToothIcon className="w-4 h-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
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
  openNotes,
  toggleNote,
}: {
  note: PatientNote;
  search: string;
  openNotes: { [key: string]: boolean };
  toggleNote: (noteId: string) => void;
}) => (
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
          content={highlightText(note.note, search)}
        />
      </div>
    )}
    <CollapsibleContent>
      <div
        className={`overflow-hidden transition-all duration-300 ${
          openNotes[note.note_id] ? "max-h-full" : "max-h-20"
        }`}
      >
        <ReadOnlyNote content={highlightText(note.note, search)} />
      </div>
      {note.image_url && (
        <Image
          src={note.image_url}
          alt="session"
          width={1000}
          height={1000}
          className="mt-8 border border-stroke rounded-xl"
        />
      )}
    </CollapsibleContent>
  </Collapsible>
);

const PatientNoteItem = ({
  note,
  onDelete,
  search,
}: {
  note: PatientNote;
  onDelete: (note_id: string) => void;
  search: string;
}) => {
  const [openNotes, setOpenNotes] = useState<{ [key: string]: boolean }>({});

  const toggleNote = (noteId: string) => {
    setOpenNotes((prev) => ({
      ...prev,
      [noteId]: !prev[noteId],
    }));
  };

  return (
    <div className="flex flex-col bg-[#FCF6F7] border border-[#E6E6E6] p-8 px-12 rounded-3xl w-full break-all">
      <NoteHeader
        noteDate={note.note_date}
        onDelete={onDelete}
        noteId={note.note_id}
      />
      <NoteContent
        note={note}
        search={search}
        openNotes={openNotes}
        toggleNote={toggleNote}
      />
    </div>
  );
};

export default PatientNoteItem;
