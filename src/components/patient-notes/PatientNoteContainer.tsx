import { PatientData } from "@/types/patientData";
import { PatientNote } from "@/types/patientNotes";
import { supabase } from "@/lib/supabaseClient";
import { decryptText } from "@/lib/encryption";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import PatientNoteItem from "./PatientNoteItem";
import SearchBar from "@/components/SearchBar";
import { Empty_Notes } from "../../../public/images";
import Image from "next/image";
import { Button } from "../ui/button";
import { PlusIcon } from "@radix-ui/react-icons";
import AddDiseaseButton from "./AddDiseaseButton";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { FunnelIcon } from "@heroicons/react/24/outline";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

type NoteWithDisease = PatientNote & {
  associatedDiseases?: string[];
};

interface PatientNoteContainerProps {
  patientId: string;
  patientData: PatientData;
}

export default function PatientNoteContainer({ patientId, patientData }: PatientNoteContainerProps) {
  const [patientNotes, setPatientNotes] = useState<PatientNote[]>([]);
  const [decryptedNotesWithDiseases, setDecryptedNotesWithDiseases] = useState<NoteWithDisease[]>([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');

  // Função para buscar notas
  const fetchNotes = async () => {
    setIsLoading(true);
    try {
      const { data: notes, error } = await supabase
        .from('patient_notes')
        .select('*')
        .eq('patient_id', patientId)
        .order('note_date', { ascending: false });

      if (error) {
        console.error('Erro ao buscar notas:', error);
        toast.error('Erro ao carregar as notas');
        return;
      }

      if (notes) setPatientNotes(notes);
    } finally {
      setIsLoading(false);
    }
  };

  // Função auxiliar para buscar notas com doenças
  const fetchNotesWithDiseases = async () => {
    const notesWithDecryption = await Promise.all(patientNotes.map(async (note) => {
      const { data: diseasesData } = await supabase
        .from('diseases')
        .select('disease')
        .eq('note_id', note.note_id);

      return {
        ...note,
        decryptedContent: decryptText(note.note),
        associatedDiseases: diseasesData?.map(d => d.disease) || []
      };
    }));

    setDecryptedNotesWithDiseases(notesWithDecryption);
  };

  // Carregar notas inicialmente
  useEffect(() => {
    fetchNotes();
  }, [patientId]);

  // Atualizar notas decriptadas e buscar doenças quando patientNotes mudar
  useEffect(() => {
    const fetchAndDecryptNotes = async () => {
      if (patientNotes.length > 0) {
        const sortedNotes = [...patientNotes].sort((a, b) => {
          const dateA = new Date(a.note_date).getTime();
          const dateB = new Date(b.note_date).getTime();
          return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
        });

        const notesWithDecryption = await Promise.all(sortedNotes.map(async (note) => {
          const { data: diseasesData, error } = await supabase
            .from('diseases')
            .select('disease')
            .eq('note_id', note.note_id);

          if (error) {
            console.error('Erro ao buscar doenças:', error);
            return {
              ...note,
              decryptedContent: decryptText(note.note),
              associatedDiseases: []
            };
          }

          return {
            ...note,
            decryptedContent: decryptText(note.note),
            associatedDiseases: diseasesData?.map(d => d.disease) || []
          };
        }));

        setDecryptedNotesWithDiseases(notesWithDecryption);
      }
    };

    fetchAndDecryptNotes();
  }, [patientNotes, sortOrder]);

  // Subscription para notas
  useEffect(() => {
    const notesSubscription = supabase
      .channel('notes_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'patient_notes',
          filter: `patient_id=eq.${patientId}`
        },
        async () => {
          await fetchNotes(); // Usar a função fetchNotes aqui também
        }
      )
      .subscribe();

    // Subscription para mudanças na tabela diseases
    const diseasesSubscription = supabase
      .channel('diseases_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'diseases'
        },
        async () => {
          if (patientNotes.length > 0) {
            await fetchNotesWithDiseases();
          }
        }
      )
      .subscribe();

    return () => {
      notesSubscription.unsubscribe();
      diseasesSubscription.unsubscribe();
    };
  }, [patientId]);

  const handleDeleteNote = async (noteId: string) => {
    try {
      const { error } = await supabase
        .from('patient_notes')
        .delete()
        .eq('note_id', noteId);

      if (error) throw error;

      setPatientNotes((prev) => prev.filter(n => n.note_id !== noteId));
      toast.success('Nota excluída com sucesso');
    } catch (err) {
      toast.error('Erro ao excluir a nota');
      console.error(err);
    }
  };

  const filteredNotes = decryptedNotesWithDiseases.filter((item) =>
    item.decryptedContent?.toLowerCase().includes(search.toLowerCase()) ||
    item.associatedDiseases?.some(disease =>
      disease.toLowerCase().includes(search.toLowerCase())
    )
  );

  // Componente Skeleton para loading
  if (isLoading) {
    return (
      <div className="flex flex-col gap-6 col-span-12 lg:col-span-8 xl:col-span-9">
        <div className="flex w-full justify-between">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-10 w-48" />
        </div>
        <Skeleton className="h-12 w-full" /> {/* SearchBar skeleton */}
        {[1, 2, 3].map((i) => ( // 3 skeletons para notas
          <div key={i} className="flex flex-col bg-[#fcf6f3] dark:bg-[#242424] border border-[#E6E6E6] dark:border-foreground/10 p-8 sm:px-12 rounded-3xl w-full">
            <div className="flex justify-between items-center border-b border-orange-200 pb-4">
              <div className="flex gap-2 items-center">
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-6 w-20" />
              </div>
              <Skeleton className="h-6 w-24" />
            </div>
            <div className="mt-4 space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-5/6" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (patientNotes.length === 0) {
    return (
      <div className="flex col-span-12 lg:col-span-8 xl:col-span-9 bg-orange-100 dark:bg-[#242424] p-14 sm:p-20 rounded-3xl flex-col w-full justify-center items-center">
        <Image priority src={Empty_Notes} alt="Empty Notes" className="w-48 h-48 sm:w-72 sm:h-72" />
        <h2 className="text-foreground text-center sm:text-left text-xl mt-4 font-medium">
          Nenhum relato de sessão adicionado
        </h2>
        <p className="text-foreground text-center sm:text-left text-sm font-normal">
          Adicione um clicando no botão abaixo para começar a registrar os relatos de sessão
        </p>
        <Link href={`/add-note/${patientId}`}>
          <Button className="w-fit mt-4">
            <PlusIcon className="w-4 h-4 mr-2" />
            Adicionar um novo relato de sessão
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 col-span-12 lg:col-span-8 xl:col-span-9">
      <div className="flex w-full flex-wrap gap-4 md:justify-between">
        <Link href={`/add-note/${patientId}`}>
          <Button className="w-fit">
            <PlusIcon className="w-4 h-4 mr-2" />
            Adicionar um novo relato de sessão
          </Button>
        </Link>
        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="gap-2 outline-none">
                <FunnelIcon className="w-6 h-6" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setSortOrder('desc')}>
                Mais recente primeiro
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortOrder('asc')}>
                Mais antiga primeiro
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <AddDiseaseButton patientId={patientId} decryptedNotes={decryptedNotesWithDiseases} />
        </div>
      </div>
      <SearchBar
        search={search}
        setSearch={setSearch}
        placeholder="Pesquisar por palavras na nota ou doenças vinculadas"
        className="w-full"
      />

      {filteredNotes.length > 0 ? (
        filteredNotes.map((note) => (
          <PatientNoteItem
            key={note.note_id}
            note={note}
            onDelete={handleDeleteNote}
            search={search}
          />
        ))
      ) : (
        <div className="col-span-full text-center text-gray-500 text-xl break-all">
          Nenhuma nota ou doença corresponde com o texto: "{search}".
        </div>
      )}
    </div>
  );
}