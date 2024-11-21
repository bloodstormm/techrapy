"use client"
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import Link from 'next/link';
import { ArrowTopLeftIcon } from '@radix-ui/react-icons';
import TipTap from '@/components/tiptap/';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabaseClient';
import { v4 as uuidv4 } from 'uuid';
import { encryptText, decryptText } from '@/lib/encryption';
import { Input } from '@/components/ui/input';
import { useRouter } from 'next/navigation';

const EditNote = ({ params }: { params: { note_id: string } }) => {
  const router = useRouter();
  const [note, setNote] = useState('');
  const [patientId, setPatientId] = useState<string>('');
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [currentImageUrl, setCurrentImageUrl] = useState<string | null>(null);

  useEffect(() => {
    const checkUserAndFetchNote = async () => {
      try {
        setIsLoading(true);
        console.log('Iniciando busca da nota:', params.note_id);

        if (!params.note_id) {
          console.error('note_id não fornecido');
          toast.error('ID da nota não encontrado');
          router.push('/all-patients');
          return;
        }

        // Verificar autenticação
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          toast.error('Você precisa estar autenticado para editar uma nota.');
          router.push('/login');
          return;
        }

        // Buscar nota
        try {
          console.log('Buscando nota no Supabase...');
          const { data: noteData, error } = await supabase
            .from('patient_notes')
            .select('*')
            .eq('note_id', params.note_id)
            .single();

          if (error) {
            console.error('Erro ao buscar nota:', error);
            throw error;
          }

          if (!noteData) {
            toast.error('Nota não encontrada');
            router.push('/patients');
            return;
          }

          console.log('Nota encontrada:', noteData);
          setPatientId(noteData.patient_id);
          setNote(decryptText(noteData.note));
          setCurrentImageUrl(noteData.image_url);
          if (noteData.image_url) {
            setImagePreview(noteData.image_url);
          }
        } catch (error) {
          console.error('Erro na busca da nota:', error);
          toast.error('Erro ao carregar a nota');
          router.push('/patients');
        }

      } catch (error) {
        console.error('Erro geral:', error);
        toast.error('Erro ao carregar a nota');
        router.push('/patients');
      } finally {
        setIsLoading(false);
      }
    };

    checkUserAndFetchNote();
  }, [params.note_id, router]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      const previewUrl = URL.createObjectURL(selectedFile);
      setImagePreview(previewUrl);
    }
  };

  const uploadImage = async (imageId: string): Promise<string | null> => {
    if (!file) return currentImageUrl;

    setIsUploading(true);
    const fileName = `img-${imageId}`;
    
    // Deletar imagem antiga se existir
    if (currentImageUrl) {
      const oldFileName = currentImageUrl.split('/').pop();
      if (oldFileName) {
        await supabase.storage
          .from('notes-images')
          .remove([oldFileName]);
      }
    }

    const { error } = await supabase.storage
      .from('notes-images')
      .upload(fileName, file);

    if (error) {
      setIsUploading(false);
      toast.error('Erro ao fazer upload da imagem.');
      return null;
    }

    const { data } = supabase.storage
      .from('notes-images')
      .getPublicUrl(fileName);

    setIsUploading(false);
    return data?.publicUrl || null;
  };

  const isContentEmpty = (content: string) => {
    const trimmedContent = content.trim();
    return trimmedContent === "" || trimmedContent === "<p></p>";
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaving(true);

    if (isContentEmpty(note)) {
      toast.error('A nota não pode estar vazia.');
      setIsSaving(false);
      return;
    }

    const encryptedNote = encryptText(note);
    let uploadedFileURL = currentImageUrl;

    if (file) {
      uploadedFileURL = await uploadImage(uuidv4());
      if (!uploadedFileURL && file) {
        setIsSaving(false);
        toast.error('Erro ao fazer upload da imagem.');
        return;
      }
    }

    try {
      const { error } = await supabase
        .from('patient_notes')
        .update({
          note: encryptedNote,
          image_url: uploadedFileURL,
        })
        .eq('note_id', params.note_id);

      if (error) throw error;

      setIsSaving(false);
      toast.success('Nota atualizada com sucesso!');
      router.push(`/patient-notes/${patientId}`);
    } catch (error: any) {
      setIsSaving(false);
      toast.error(`Erro ao atualizar a nota: ${error.message || 'Erro desconhecido'}`);
    }
  };

  const handleRemoveImage = async () => {
    try {
      if (currentImageUrl) {
        const oldFileName = currentImageUrl.split('/').pop();
        if (oldFileName) {
          await supabase.storage
            .from('notes-images')
            .remove([oldFileName]);
        }
      }
      
      const { error } = await supabase
        .from('patient_notes')
        .update({
          image_url: null
        })
        .eq('note_id', params.note_id);

      if (error) throw error;

      setCurrentImageUrl(null);
      setImagePreview(null);
      setFile(null);
      toast.success('Imagem removida com sucesso');
    } catch (error) {
      toast.error('Erro ao remover a imagem');
      console.error(error);
    }
  };

  return (
    <>
      {isLoading ? (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-orange-500"></div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="w-full h-full flex flex-col container mx-auto justify-center mt-12">
          <Link
            href={`/patient-notes/${patientId}`}
            className="flex items-center gap-1 hover:gap-3 transition-all"
          >
            <ArrowTopLeftIcon className="w-4 h-4" />
            Voltar
          </Link>
          <div className="flex flex-col items-center gap-1">
            <h1 className="text-4xl text-orange-900 dark:text-primary font-cabinetGrotesk mb-1">
              Editar Relato de sessão
            </h1>
            <p className="text-lg text-center mb-8">
              Faça as alterações necessárias no relato
            </p>
          </div>

          <div className="w-3/4 mx-auto mb-32 space-y-6">
            <TipTap onChange={setNote} content={note} isSaving={isSaving} />
            <div className="flex flex-col items-center gap-1 border border-primary dark:border-foreground/30 p-4 rounded-lg bg-orange-100 dark:bg-gray-950">
              <label htmlFor="image" className="mt-4 block text-xl">
                {currentImageUrl ? 'Alterar Imagem' : 'Adicionar Imagem'}
              </label>
              <Input 
                type="file" 
                className="mt-4 file:flex file:py-1 file:items-center justify-center file:w-full file:mb-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold bg-primary file:text-white hover:bg-orange-700 file:transition-all file:duration-150" 
                id="image" 
                onChange={handleFileChange} 
              />
              {(imagePreview || currentImageUrl) && (
                <div className="mt-4 space-y-4">
                  <img 
                    src={imagePreview || currentImageUrl || ''} 
                    alt="Pré-visualização da imagem" 
                    className="max-w-[500px] h-auto rounded-lg" 
                  />
                  <Button 
                    type="button"
                    variant="destructive"
                    onClick={handleRemoveImage}
                    className="w-full"
                  >
                    Remover imagem
                  </Button>
                </div>
              )}
            </div>
            <Button
              type="submit"
              className={`mt-4 transition-all duration-300 w-full h-12 ${note ? 'bg-primary' : 'disabled'} ${isSaving || isUploading ? 'bg-orange-700' : 'bg-primary'}`}
              disabled={isSaving || isUploading || isContentEmpty(note)}
            >
              {isSaving || isUploading ? 'Salvando...' : 'Salvar alterações'}
            </Button>
          </div>
        </form>
      )}
    </>
  );
};

export default EditNote;