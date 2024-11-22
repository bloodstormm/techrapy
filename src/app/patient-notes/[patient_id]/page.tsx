"use client";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeftStartOnRectangleIcon, Cog6ToothIcon, GlobeAltIcon, PlusIcon } from "@heroicons/react/24/outline";
import { ArrowTopLeftIcon } from "@radix-ui/react-icons";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { FamilyDisease, Disease, PatientData } from "@/types/patientData";
import { useEffect, useState } from "react";
import { PatientNote } from "@/types/patientNotes";
import PatientNoteItem from "@/components/patientNoteItem";
import ReadOnlyNote from "@/components/tiptap/ReadOnlyNote";
import { toast } from 'sonner';
import { Empty_Notes } from "../../../../public/images";
import Image from "next/image";
import SearchBar from "@/components/SearchBar";
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { useRouter } from 'next/navigation';
import { decryptText } from '@/lib/encryption';
import { supabase } from '@/lib/supabaseClient';
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip";
import { formatDate } from "@/i18n/formatDate";
import AddDiseaseDialog from "@/components/addDiseaseDialog";
import AddFamilyDiseaseDialog from "@/components/addFamilyDiseaseDialog";
import { Trash2 } from "lucide-react";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const PatientSummaries = ({ params }: { params: { patient_id: string } }) => {
  const router = useRouter();
  const [patientData, setPatientData] = useState<PatientData | null>(null);
  const [patientNotes, setPatientNotes] = useState<PatientNote[]>([]);
  const [diseases, setDiseases] = useState<Disease[]>([]);
  const [familyDiseases, setFamilyDiseases] = useState<FamilyDisease[]>([]);
  const [decryptedNotes, setDecryptedNotes] = useState<PatientNote[]>([]);
  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isOpen, setIsOpen] = useState(false);
  const [isOpenFamilyDisease, setIsOpenFamilyDisease] = useState(false);
  const [isEditingDiseases, setIsEditingDiseases] = useState(false);
  const [editedDiseaseInfo, setEditedDiseaseInfo] = useState("");
  const [isEditingPatientInfo, setIsEditingPatientInfo] = useState(false);
  const [editedPatientInfo, setEditedPatientInfo] = useState("");

  useEffect(() => {
    const successMessage = localStorage.getItem('successMessage');
    if (successMessage) {
      const messageShown = localStorage.getItem('messageShown');
      if (!messageShown) {
        setTimeout(() => {
          toast.success(successMessage);
          localStorage.removeItem('successMessage');
          localStorage.removeItem('messageShown');
        }, 100);
        localStorage.setItem('messageShown', 'true');
      }
    }
  }, []);

  // Verificar autenticação e propriedade do paciente
  useEffect(() => {
    const checkAuthAndOwnership = async () => {
      try {
        // Verificar se o usuário está autenticado
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          toast.error("Você precisa estar autenticado para acessar esta página");
          router.push('/login');
          return;
        }

        // Buscar o paciente e verificar se pertence ao terapeuta
        const { data: patient, error: patientError } = await supabase
          .from('patients')
          .select('*')
          .eq('patient_id', params.patient_id)
          .eq('therapist_owner', user.id)
          .single();

        if (patientError || !patient) {
          toast.error("Você não tem permissão para acessar as notas deste paciente");
          router.push('/all-patients');
          return;
        }

        setPatientData(patient);

        // Buscar as notas do paciente (já garantido que pertence ao terapeuta)
        const { data: notes, error: notesError } = await supabase
          .from('patient_notes')
          .select(`
            *,
            patients!inner (
              therapist_owner
            )
          `)
          .eq('patient_id', params.patient_id)
          .eq('patients.therapist_owner', user.id)
          .order('note_date', { ascending: false });

        if (notesError) {
          throw notesError;
        }

        setPatientNotes(notes);
      } catch (err: any) {
        console.error('Erro ao verificar autorização:', err);
        setError('Erro ao carregar dados do paciente');
      } finally {
        setLoading(false);
      }

      // Buscando doenças do paciente
      const { data: diseases, error: diseasesError } = await supabase
        .from('diseases')
        .select('*')
        .eq('patient_id', params.patient_id);
      if (diseasesError) {
        throw diseasesError;
      }
      setDiseases(diseases);

      // Buscando doenças do paciente
      const { data: familyDiseases, error: familyDiseasesError } = await supabase
        .from('family_diseases')
        .select('*')
        .eq('patient_id', params.patient_id);
      if (familyDiseasesError) {
        throw familyDiseasesError;
      }
      setFamilyDiseases(familyDiseases);
    };

    checkAuthAndOwnership();
  }, [params.patient_id, router, supabase]);

  const fetchFamilyDiseases = async () => {
    const { data: newFamilyDiseases } = await supabase
      .from('family_diseases')
      .select('*')
      .eq('patient_id', params.patient_id);
    if (newFamilyDiseases) setFamilyDiseases(newFamilyDiseases);
  }

  useEffect(() => {
    const decryptAllNotes = () => {
      const notesWithDecryption = patientNotes.map(note => ({
        ...note,
        decryptedContent: decryptText(note.note),
      }));
      setDecryptedNotes(notesWithDecryption);
    };

    if (patientNotes.length > 0) {
      decryptAllNotes();
    }
  }, [patientNotes]);

  if (loading) return (
    <div className="flex justify-center items-center h-screen">
      <div className="flex flex-col gap-4">
        <div className="flex justify-center items-center">
          <div className="w-16 h-16 border-t-2 border-orange-900 border-solid rounded-full animate-spin"></div>
        </div>
        <p className="text-center text-orange-900 text-xl font-medium">Carregando dados do paciente...</p>
      </div>
    </div>
  );

  if (error) return <>
    <div className="flex justify-center items-center h-screen">
      <p className="text-center text-orange-400 text-xl font-medium">Error: {error}</p>
    </div>
  </>;
  if (!patientData) return <>
    <div className="flex justify-center items-center h-screen">
      <p className="text-center text-orange-400 text-xl font-medium">Nenhum paciente encontrado</p>
    </div>
  </>;

  console.log(diseases);

  const {
    patient_name,
    patient_type,
    session_day,
    birthdate,
    phone_number,
    marital_status,
    payment_type,
    guardian_phone_number,
    guardian_name,
    patient_gender,
  } = patientData;



  const handleDeleteNote = async (noteId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('Você precisa estar autenticado para realizar esta ação');
        return;
      }

      // Verificar se a nota pertence ao terapeuta
      const { data: note, error: fetchError } = await supabase
        .from('patient_notes')
        .select('patient_id')
        .eq('note_id', noteId)
        .single();

      if (fetchError || !note) {
        throw fetchError || new Error('Nota não encontrada');
      }

      // Verificar se o paciente pertence ao terapeuta
      const { data: patient, error: patientError } = await supabase
        .from('patients')
        .select('therapist_owner')
        .eq('patient_id', note.patient_id)
        .single();

      if (patientError || !patient || patient.therapist_owner !== user.id) {
        toast.error('Você não tem permissão para excluir esta nota');
        return;
      }

      // Deletar a nota
      const { error } = await supabase
        .from('patient_notes')
        .delete()
        .eq('note_id', noteId);

      if (error) {
        throw error;
      }

      setPatientNotes((prevNotes) => prevNotes.filter(n => n.note_id !== noteId));
      toast.success('Nota excluída com sucesso');
    } catch (err: any) {
      toast.error('Erro ao excluir a nota: ' + err.message);
    }
  };

  const filteredNotes = decryptedNotes.filter((item) =>
    item.decryptedContent?.toLowerCase().includes(search.toLowerCase())
  );

  const handleUpdateDiseaseInfo = async () => {
    try {
      const { error } = await supabase
        .from('patients')
        .update({ more_info_about_diseases: editedDiseaseInfo })
        .eq('patient_id', params.patient_id);

      if (error) throw error;

      setPatientData(prev => prev ? {
        ...prev,
        more_info_about_diseases: editedDiseaseInfo
      } : null);

      setIsEditingDiseases(false);
      toast.success('Informações atualizadas com sucesso');
    } catch (error) {
      toast.error('Erro ao atualizar informações');
      console.error(error);
    }
  };

  const handleUpdatePatientInfo = async () => {
    try {
      const { error } = await supabase
        .from('patients')
        .update({ more_info_about_patient: editedPatientInfo })
        .eq('patient_id', params.patient_id);

      if (error) throw error;

      setPatientData(prev => prev ? {
        ...prev,
        more_info_about_patient: editedPatientInfo
      } : null);

      setIsEditingPatientInfo(false);
      toast.success('Informações atualizadas com sucesso');
    } catch (error) {
      toast.error('Erro ao atualizar informações');
      console.error(error);
    }
  };

  const handleDeleteDisease = async (diseaseId: string) => {
    try {
      const { error } = await supabase
        .from('diseases')
        .delete()
        .eq('disease_id', diseaseId);

      if (error) throw error;

      // Atualiza o estado local
      setDiseases(prev => prev.filter(d => d.disease_id !== diseaseId));
      toast.success('Doença removida com sucesso');
    } catch (error) {
      toast.error('Erro ao remover doença');
      console.error(error);
    }
  };

  const handleDeleteFamilyDisease = async (diseaseId: string) => {
    try {
      const { error } = await supabase
        .from('family_diseases')
        .delete()
        .eq('relative_disease_id', diseaseId);

      if (error) throw error;

      // Atualiza o estado local
      setFamilyDiseases(prev => prev.filter(d => d.relative_disease_id !== diseaseId));
      toast.success('Doença familiar removida com sucesso');
    } catch (error: any) {
      toast.error('Erro ao remover doença familiar: ' + error.message);
      console.error(error);
    }
  };

  return (
    <div className="container mx-auto flex lg:flex-row flex-col gap-10 mt-10 mb-32">
      {/* Lado esquerdo */}
      <div className="flex relative flex-col h-fit bg-[#FCF6F7] dark:bg-[#242424] p-8 space-y-4 rounded-3xl shadow-lg overflow-hidden w-full lg:w-96">
        <Link
          href="/all-patients"
          className="flex items-center gap-1 hover:gap-3 transition-all"
        >
          <ArrowTopLeftIcon className="w-4 h-4" />
          Voltar
        </Link>
        <div>
          <h1 className="text-2xl font-bold capitalize">{patient_name}</h1>
          <p className="text-sm text-gray-500">
            Tipo de paciente: <span className="capitalize">{patient_type}</span>
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-1 gap-4">
          <div className="flex flex-col">
            <span className=" text-orange-400">Gênero</span>
            <p className="text-sm text-gray-500 capitalize">{patient_gender}</p>
            <span className=" text-orange-400 mt-4">Histórico de doenças</span>
            <div className="flex gap-2 gap-y-3 mt-2 flex-wrap w-full">
              {diseases && diseases.length > 0 ? (
                diseases.map((disease, index) => (
                  <Dialog>
                    <DialogTrigger asChild>
                      <div className="text-sm px-3 py-1 rounded-xl bg-orange-50 border border-orange-300 text-orange-900 relative group cursor-pointer">
                        <p className="capitalize">{disease.disease.trim()}</p>
                        <div className="absolute inset-0 bg-red-50/0 group-hover:bg-red-50/50 transition-colors rounded-xl flex items-center justify-center">
                          <Trash2 className="w-4 h-4 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      </div>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Remover doença</DialogTitle>
                        <DialogDescription>
                          Tem certeza que deseja remover {disease.disease.trim()}?
                        </DialogDescription>
                      </DialogHeader>
                      <DialogFooter>
                        <DialogClose asChild>
                          <Button variant="outline">Cancelar</Button>
                        </DialogClose>
                        <Button
                          variant="destructive"
                          onClick={() => handleDeleteDisease(disease.disease_id)}
                        >
                          Remover
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                ))
              ) : (
                <p className="text-sm text-gray-500">
                  Não há histórico de doenças
                </p>
              )}
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-orange-400">Histórico de doenças na família</span>
            <div className="flex gap-2 gap-y-3 mt-2 flex-wrap w-full">
              {familyDiseases && familyDiseases.length > 0 ? (
                familyDiseases.map((disease, index) => (
                  <TooltipProvider key={index}>
                    <Tooltip>
                      <TooltipTrigger>
                        <Dialog>
                          <DialogTrigger asChild>
                            <div className="text-sm px-3 py-1 rounded-xl bg-orange-50 border border-orange-300 text-orange-900 relative group cursor-pointer">
                              <p className="capitalize">{disease.disease.trim()}</p>
                              <div className="absolute inset-0 bg-red-50/0 group-hover:bg-red-50/50 transition-colors rounded-xl flex items-center justify-center">
                                <Trash2 className="w-4 h-4 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                              </div>
                            </div>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Remover doença familiar</DialogTitle>
                              <DialogDescription>
                                Tem certeza que deseja remover {disease.disease.trim()}?
                              </DialogDescription>
                            </DialogHeader>
                            <DialogFooter>
                              <DialogClose asChild>
                                <Button variant="outline">Cancelar</Button>
                              </DialogClose>
                              <Button
                                variant="destructive"
                                onClick={() => handleDeleteFamilyDisease(disease.relative_disease_id)}
                              >
                                Remover
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="text-sm capitalize">Parentesco: {disease.relationship}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ))
              ) : (
                <p className="text-sm text-gray-500">
                  Não há histórico de doenças
                </p>
              )}
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-orange-400">Dia(s) da sessão</span>
            <p className="text-sm text-gray-500 capitalize">{session_day}</p>
          </div>
          <div className="flex flex-col">
            <span className="text-orange-400">Idade</span>
            <p className="text-sm text-gray-500 ca">
              {new Date().getFullYear() - new Date(birthdate).getFullYear()} anos
            </p>
          </div>
          {patient_type === "Criança" && (
            <div className="flex flex-col space-y-4">
              <div>
                <span className="text-orange-400">Nome do responsável</span>
                <p className="text-sm text-gray-500">{guardian_name}</p>
              </div>
              <div className="gap-4">
                <span className="text-orange-400">Telefone do responsável</span>
                {guardian_phone_number ? (
                  <p className="text-sm text-gray-500">{guardian_phone_number}</p>
                ) : (
                  <p className="text-sm text-gray-500">Sem telefone cadastrado</p>
                )}
              </div>
            </div>
          )}
          {patient_type !== "Criança" && (
            <>
              <div className="flex flex-col">
                <span className="text-orange-400">Telefone</span>
                <p className="text-sm text-gray-500">{phone_number}</p>
              </div>
              <div className="flex flex-col">
                <span className="text-orange-400">Estado civil</span>
                <p className="text-sm text-gray-500 capitalize">{marital_status}</p>
              </div>
            </>
          )}
          <div className="flex flex-col">
            <span className="text-orange-400">Tipo de pagamento</span>
            <p className="text-sm text-gray-500 capitalize">{payment_type}</p>
          </div>
        </div>
        <div className="flex flex-col">
          <Separator className="bg-orange-200 mb-4" />
          {patientData.more_info_about_patient && (
            <>
              <Drawer>
                <DrawerTrigger className="text-orange-400">
                  <Button variant="outline" className="w-full whitespace-normal h-full hover:bg-orange-50 p-3 rounded-xl">
                    Mais informações do paciente
                  </Button>
                </DrawerTrigger>
                <DrawerContent className="pb-4">
                  <div className="w-full max-w-4xl mx-auto">
                    <DrawerHeader className="px-0">
                      <DrawerTitle className="text-orange-400">Mais informações do paciente</DrawerTitle>
                    </DrawerHeader>
                    <DrawerDescription>
                      {isEditingPatientInfo ? (
                        <textarea

                          value={editedPatientInfo}
                          onChange={(e) => setEditedPatientInfo(e.target.value)}
                          className="w-full p-2 border rounded-md min-h-[150px] text-sm"
                        />
                      ) : (
                        <p className="text-foreground text-sm">{patientData.more_info_about_patient}</p>
                      )}
                    </DrawerDescription>
                    <DrawerFooter className="flex gap-2">
                      {isEditingPatientInfo ? (
                        <Button
                          variant="default"
                          onClick={handleUpdatePatientInfo}
                          className="bg-orange-400 w-full hover:bg-orange-500"
                        >
                          Salvar alterações
                        </Button>
                      ) : (
                        <div className="flex gap-2 mt-6 w-full justify-center">
                          <DrawerClose>
                            <Button variant="default" className="w-80">Fechar</Button>
                          </DrawerClose>
                          <Button
                            variant="outline"
                            onClick={() => {
                              setIsEditingPatientInfo(true);
                              setEditedPatientInfo(patientData.more_info_about_patient || "");
                            }}
                            className="w-80 text-orange-400"
                          >
                            Editar
                          </Button>
                        </div>
                      )}
                    </DrawerFooter>
                  </div>
                </DrawerContent>
              </Drawer>
            </>
          )}
        </div>
        <div className="flex flex-col">
          {patientData.more_info_about_diseases && (
            <>
              <Drawer>
                <DrawerTrigger className="text-orange-400">
                  <Button variant="outline" className="w-full whitespace-normal h-full hover:bg-orange-50 p-3 rounded-xl">
                    Mais informações sobre doenças do paciente
                  </Button>
                </DrawerTrigger>
                <DrawerContent>
                  <div className="max-w-4xl mx-auto">
                    <DrawerHeader className="container px-0 mx-auto">
                      <DrawerTitle>Mais informações sobre doenças do paciente</DrawerTitle>
                    </DrawerHeader>
                    <DrawerDescription className="container mx-auto">
                      {isEditingDiseases ? (
                        <textarea
                          value={editedDiseaseInfo}
                          onChange={(e) => setEditedDiseaseInfo(e.target.value)}
                          className="w-full p-2 border rounded-md min-h-[150px] text-sm"
                        />
                      ) : (
                        <p className="text-foreground text-sm">{patientData.more_info_about_diseases}</p>
                      )}
                    </DrawerDescription>
                    <DrawerFooter className="flex gap-2">
                      {isEditingDiseases ? (
                        <Button
                          variant="default"
                          onClick={handleUpdateDiseaseInfo}
                          className="bg-orange-400 w-full hover:bg-orange-500"
                        >
                          Salvar alterações
                        </Button>
                      ) : (
                        <div className="flex gap-2 mt-6 w-full justify-center">
                          <DrawerClose>
                            <Button variant="default" className="w-80">Fechar</Button>
                          </DrawerClose>
                          <Button
                            variant="outline"
                            onClick={() => {
                              setIsEditingDiseases(true);
                              setEditedDiseaseInfo(patientData.more_info_about_diseases || "");
                            }}
                            className="w-80 text-orange-400"
                          >
                            Editar
                          </Button>
                        </div>
                      )}
                    </DrawerFooter>
                  </div>
                </DrawerContent>
              </Drawer>
            </>
          )}
        </div>
      </div>
      {/* Lado direito */}
      <div className="flex flex-col w-full">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-8 w-full overflow-y-auto hide-scrollbar">
            <div className="flex justify-between items-center mb-6">
              <DropdownMenu>
                <DropdownMenuTrigger className="">
                  <Button variant="outline" className="flex items-center justify-center">
                    <PlusIcon className="w-4 h-4 gap-2" />
                    <p className="font-medium">Adicionar uma nova doença</p>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-white dark:bg-background text-center w-full">
                  <AddDiseaseDialog
                    isOpen={isOpen}
                    setIsOpen={setIsOpen}
                    patientId={params.patient_id}
                    decryptedNotes={decryptedNotes}
                    onDiseaseAdded={async () => {
                      const { data: newDiseases } = await supabase
                        .from('diseases')
                        .select('*')
                        .eq('patient_id', params.patient_id);
                      if (newDiseases) setDiseases(newDiseases);
                    }}
                  />
                  <AddFamilyDiseaseDialog
                    isOpen={isOpenFamilyDisease}
                    setIsOpen={setIsOpenFamilyDisease}
                    patientId={params.patient_id}
                    onDiseaseAdded={fetchFamilyDiseases}
                  />
                </DropdownMenuContent>
              </DropdownMenu>

              <Link href={`/add-note/${patientData.patient_id}`}>
                <Button variant="default" className=" flex items-center justify-center hover:bg-orange-500">
                  <PlusIcon className="w-4 h-4 gap-2" />
                  <p className="font-medium">Adicionar um novo relato de sessão</p>
                </Button>
              </Link>
            </div>
            {patientNotes.length === 0 ? (
              <div className="flex bg-orange-100 dark:bg-[#242424] p-20 rounded-3xl flex-col w-full justify-center items-center overflow-y-auto hide-scrollbar">
                <Image priority src={Empty_Notes} alt="Empty Notes" className="w-72 h-72" />
                <h2 className="text-foreground text-xl mt-4 font-medium">Nenhum relato de sessão adicionado</h2>
                <p className="text-foreground text-sm font-normal">Adicione um clicando no botão acima para começar a registrar os relatos de sessão</p>
              </div>
            ) : (
              <>
                <SearchBar search={search} setSearch={setSearch} placeholder="Pesquisar por qualquer palavra" />
                {filteredNotes.length > 0 ? (filteredNotes.map((note) => (
                  <PatientNoteItem search={search} key={note.note_id} note={note} onDelete={handleDeleteNote} />
                ))) : (
                  <div className="col-span-full text-center text-gray-500 text-xl break-all">
                    Nenhuma nota corresponde com o texto: "{search}".
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientSummaries;
