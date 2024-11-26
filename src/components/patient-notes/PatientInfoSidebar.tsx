import { PatientData, Disease, FamilyDisease } from "@/types/patientData";
import { supabase } from "@/lib/supabaseClient";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import Link from "next/link";
import { ArrowTopLeftIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Trash2 } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { PatientNote } from "@/types/patientNotes";
import { decryptText } from "@/lib/encryption";

interface PatientInfoSidebarProps {
  patientData: PatientData;
  patientId: string;
}

export default function PatientInfoSidebar({ patientData, patientId }: PatientInfoSidebarProps) {
  const [diseases, setDiseases] = useState<Disease[]>([]);
  const [familyDiseases, setFamilyDiseases] = useState<FamilyDisease[]>([]);
  const [openDeleteDialogs, setOpenDeleteDialogs] = useState<{ [key: string]: boolean }>({});

  const [isEditingDiseases, setIsEditingDiseases] = useState(false);
  const [editedDiseaseInfo, setEditedDiseaseInfo] = useState("");
  const [isEditingPatientInfo, setIsEditingPatientInfo] = useState(false);
  const [editedPatientInfo, setEditedPatientInfo] = useState("");
  const [decryptedNotes, setDecryptedNotes] = useState<PatientNote[]>([]);

  // Função auxiliar para buscar doenças
  const fetchDiseases = async () => {
    const { data: diseases } = await supabase
      .from('diseases')
      .select('*')
      .eq('patient_id', patientId);
    if (diseases) setDiseases(diseases);
  };

  // Função auxiliar para buscar doenças familiares
  const fetchFamilyDiseases = async () => {
    const { data: familyDiseases } = await supabase
      .from('family_diseases')
      .select('*')
      .eq('patient_id', patientId);
    if (familyDiseases) setFamilyDiseases(familyDiseases);
  };

  // Carregar doenças inicialmente
  useEffect(() => {
    fetchDiseases();
    fetchFamilyDiseases();
  }, [patientId]);

  // Subscription para doenças
  useEffect(() => {
    const diseasesSubscription = supabase
      .channel('diseases_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'diseases',
          filter: `patient_id=eq.${patientId}`
        },
        async () => {
          await fetchDiseases();
        }
      )
      .subscribe();

    const familyDiseasesSubscription = supabase
      .channel('family_diseases_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'family_diseases',
          filter: `patient_id=eq.${patientId}`
        },
        async () => {
          await fetchFamilyDiseases();
        }
      )
      .subscribe();

    return () => {
      diseasesSubscription.unsubscribe();
      familyDiseasesSubscription.unsubscribe();
    };
  }, [patientId]);

  useEffect(() => {
    const fetchNotes = async () => {
      const { data: notes } = await supabase
        .from('patient_notes')
        .select('*')
        .eq('patient_id', patientId)
        .order('note_date', { ascending: false });

      if (notes) {
        const decryptedNotes = notes.map(note => ({
          ...note,
          decryptedContent: decryptText(note.note)
        }));
        setDecryptedNotes(decryptedNotes);
      }
    };

    fetchNotes();
  }, [patientId]);

  const handleUpdateDiseaseInfo = async () => {
    try {
      const { error } = await supabase
        .from('patients')
        .update({ more_info_about_diseases: editedDiseaseInfo })
        .eq('patient_id', patientId);

      if (error) throw error;
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
        .eq('patient_id', patientId);

      if (error) throw error;
      setIsEditingPatientInfo(false);
      toast.success('Informações atualizadas com sucesso');
    } catch (error) {
      toast.error('Erro ao atualizar informações');
      console.error(error);
    }
  };

  const handleDeleteAndCloseDialog = async (diseaseId: string) => {
    try {
      const { error } = await supabase
        .from('diseases')
        .delete()
        .eq('disease_id', diseaseId);

      if (error) throw error;
      
      // Atualiza o estado local removendo a doença
      setDiseases(prevDiseases => 
        prevDiseases.filter(disease => disease.disease_id !== diseaseId)
      );
      
      // Fecha o dialog específico
      setOpenDeleteDialogs(prev => ({
        ...prev,
        [diseaseId]: false
      }));
      
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

      // Atualiza o estado local removendo a doença familiar
      setFamilyDiseases(prevDiseases => 
        prevDiseases.filter(disease => disease.relative_disease_id !== diseaseId)
      );
      
      toast.success('Doença familiar removida com sucesso');
    } catch (error) {
      toast.error('Erro ao remover doença familiar');
      console.error(error);
    }
  };

  const handleDiseaseAdded = async () => {
    // Recarrega as doenças
    const { data: newDiseases } = await supabase
      .from('diseases')
      .select('*')
      .eq('patient_id', patientId);
    
    if (newDiseases) setDiseases(newDiseases);
  };

  return (
    <div className="flex relative flex-col h-fit bg-[#fcf6f3] dark:bg-[#242424] p-8 space-y-4 rounded-3xl shadow-lg overflow-hidden w-full lg:w-70 col-span-12 lg:col-span-4 xl:col-span-3">
      <Link
        href="/all-patients"
        className="flex items-center gap-1 hover:gap-3 transition-all"
      >
        <ArrowTopLeftIcon className="w-4 h-4" />
        Voltar
      </Link>

      <div>
        <h1 className="text-2xl font-bold capitalize">{patientData.patient_name}</h1>
        <p className="text-sm text-gray-500">
          Tipo de paciente: <span className="capitalize">{patientData.patient_type}</span>
        </p>
      </div>

      <div className="grid gap-4">
        <div className="flex flex-col">
          <span className="text-orange-400 dark:text-foreground">Gênero</span>
          <p className="text-sm text-gray-500 capitalize">{patientData.patient_gender}</p>

          <span className="text-orange-400 dark:text-foreground mt-4">Histórico de doenças</span>
          <div className="flex gap-2 gap-y-3 mt-2 flex-wrap w-full">
            {diseases && diseases.length > 0 ? (
              diseases.map((disease) => (
                <Dialog 
                  key={disease.disease_id}
                  open={openDeleteDialogs[disease.disease_id]}
                  onOpenChange={(open) => 
                    setOpenDeleteDialogs(prev => ({
                      ...prev,
                      [disease.disease_id]: open
                    }))
                  }
                >
                  <DialogTrigger asChild>
                    <div className="text-sm px-3 py-1 rounded-xl bg-orange-50 dark:bg-orange-900 border border-orange-300 dark:border-none text-orange-900 dark:text-orange-50 relative group cursor-pointer">
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
                        onClick={() => handleDeleteAndCloseDialog(disease.disease_id)}
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
          <span className="text-orange-400 dark:text-foreground">Histórico de doenças na família</span>
          <div className="flex gap-2 gap-y-3 mt-2 flex-wrap w-full">
            {familyDiseases && familyDiseases.length > 0 ? (
              familyDiseases.map((disease) => (
                <TooltipProvider key={disease.relative_disease_id}>
                  <Tooltip>
                    <TooltipTrigger>
                      <Dialog>
                        <DialogTrigger asChild>
                          <div className="text-sm px-3 py-1 rounded-xl bg-orange-50 border border-orange-300 dark:bg-orange-900 text-foreground 
                          dark:border-none
                          dark:text-foreground relative group cursor-pointer">
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
          <span className="text-orange-400 dark:text-foreground">Dia(s) da sessão</span>
          <p className="text-sm text-gray-500 capitalize">{patientData.session_day}</p>
        </div>

        <div className="flex flex-col">
          <span className="text-orange-400 dark:text-foreground">Idade</span>
          <p className="text-sm text-gray-500">
            {new Date().getFullYear() - new Date(patientData.birthdate).getFullYear()} anos
          </p>
        </div>

        {patientData.patient_type === "Criança" ? (
          <div className="flex flex-col space-y-4">
            <div>
              <span className="text-orange-400 dark:text-foreground">Nome do responsável</span>
              <p className="text-sm text-gray-500">{patientData.guardian_name}</p>
            </div>
            <div>
              <span className="text-orange-400 dark:text-foreground">Telefone do responsável</span>
              {patientData.guardian_phone_number ? (
                <p className="text-sm text-gray-500">{patientData.guardian_phone_number}</p>
              ) : (
                <p className="text-sm text-gray-500">Sem telefone cadastrado</p>
              )}
            </div>
          </div>
        ) : (
          <>
            <div className="flex flex-col">
              <span className="text-orange-400 dark:text-foreground">Telefone</span>
              <p className="text-sm text-gray-500">{patientData.phone_number}</p>
            </div>
            <div className="flex flex-col">
              <span className="text-orange-400 dark:text-foreground">Estado civil</span>
              <p className="text-sm text-gray-500 capitalize">{patientData.marital_status}</p>
            </div>
          </>
        )}

        <div className="flex flex-col">
          <span className="text-orange-400 dark:text-foreground">Tipo de pagamento</span>
          <p className="text-sm text-gray-500 capitalize">{patientData.payment_type}</p>
        </div>
      </div>

      <div className="flex flex-col">
        <Separator className="bg-orange-200 mb-4" />


        {patientData.more_info_about_patient && (
          <Drawer>
            <DrawerTrigger className="text-orange-400 dark:text-foreground mt-4">
              <Button variant="outline" className="w-full whitespace-normal h-full hover:bg-orange-50 p-3 rounded-xl">
                Mais informações do paciente
              </Button>
            </DrawerTrigger>
            <DrawerContent>
              <div className="w-full max-w-4xl px-6 sm:px-0 mx-auto">
                <DrawerHeader>
                  <DrawerTitle>Mais informações do paciente</DrawerTitle>
                </DrawerHeader>
                <DrawerDescription className="px-4">
                  {isEditingPatientInfo ? (
                    <textarea
                      value={editedPatientInfo}
                      onChange={(e) => setEditedPatientInfo(e.target.value)}
                      className="w-full p-2 border border-border bg-foreground/5 text-foreground rounded-md min-h-[150px] text-sm"
                    />
                  ) : (
                    <p className="text-foreground text-sm">{patientData.more_info_about_patient}</p>
                  )}
                </DrawerDescription>
                <DrawerFooter>
                  {isEditingPatientInfo ? (
                    <div className="flex w-full mt-6 gap-2">
                      <Button
                        variant="outline"
                        onClick={() => setIsEditingPatientInfo(false)}
                        className="w-full"
                      >
                        Cancelar
                      </Button>
                      <Button onClick={handleUpdatePatientInfo} className="w-full">
                        Salvar alterações
                      </Button>
                    </div>
                  ) : (
                    <div className="flex w-full mt-6 gap-2">
                      <DrawerClose asChild>
                        <Button variant="outline" className="w-full">Fechar</Button>
                      </DrawerClose>
                      <Button
                        onClick={() => {
                          setIsEditingPatientInfo(true);
                          setEditedPatientInfo(patientData.more_info_about_patient || "");
                        }}
                        className="w-full"
                      >
                        Editar
                      </Button>
                    </div>
                  )}
                </DrawerFooter>
              </div>
            </DrawerContent>
          </Drawer>
        )}

        {patientData.more_info_about_diseases && (
          <Drawer>
            <DrawerTrigger className="text-orange-400 dark:text-foreground mt-4">
              <Button variant="outline" className="w-full whitespace-normal h-full hover:bg-orange-50 p-3 rounded-xl">
                Mais informações sobre doenças
              </Button>
            </DrawerTrigger>
            <DrawerContent>
              <div className="w-full max-w-4xl px-6 sm:px-0 mx-auto">
                <DrawerHeader>
                  <DrawerTitle>Mais informações sobre doenças</DrawerTitle>
                </DrawerHeader>
                <DrawerDescription className="px-4">
                  {isEditingDiseases ? (
                    <textarea
                      value={editedDiseaseInfo}
                      onChange={(e) => setEditedDiseaseInfo(e.target.value)}
                      className="w-full p-2 border border-border bg-foreground/5 text-foreground rounded-md min-h-[150px] text-sm"
                    />
                  ) : (
                    <p className="text-foreground text-sm">{patientData.more_info_about_diseases}</p>
                  )}
                </DrawerDescription>
                <DrawerFooter>
                  {isEditingDiseases ? (
                    <div className="flex w-full mt-6 gap-2">
                      <Button
                        variant="outline"
                        onClick={() => setIsEditingDiseases(false)}
                        className="w-full"
                      >
                        Cancelar
                      </Button>
                      <Button onClick={handleUpdateDiseaseInfo} className="w-full">
                        Salvar alterações
                      </Button>
                    </div>
                  ) : (
                    <div className="flex w-full mt-6 gap-2">
                      <DrawerClose asChild>
                        <Button variant="outline" className="w-full">Fechar</Button>
                      </DrawerClose>
                      <Button
                        onClick={() => {
                          setIsEditingDiseases(true);
                          setEditedDiseaseInfo(patientData.more_info_about_diseases || "");
                        }}
                        className="w-full"
                      >
                        Editar
                      </Button>
                    </div>
                  )}
                </DrawerFooter>
              </div>
            </DrawerContent>
          </Drawer>
        )}
      </div>
    </div>
  );
}