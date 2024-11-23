"use client"
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { navigate } from './actions';
import Link from 'next/link';
import { ArrowTopLeftIcon } from '@radix-ui/react-icons';
import TipTap from '@/components/tiptap/';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabaseClient';
import { v4 as uuidv4 } from 'uuid';
import { encryptText } from '@/lib/encryption';
import { Input } from '@/components/ui/input';
import ImageUploader from '@/components/imageUploader';

const AddNote = ({ params }: { params: { patient_id: string } }) => {
	const [note, setNote] = useState('');
	const [isSaving, setIsSaving] = useState(false);
	const [file, setFile] = useState<File | null>(null);
	const [isUploading, setIsUploading] = useState(false);
	const [imagePreview, setImagePreview] = useState<string | null>(null);
	const [currentImageUrl, setCurrentImageUrl] = useState<string | null>(null);

	useEffect(() => {
		const checkUser = async () => {
			const { data: { user } } = await supabase.auth.getUser();
			if (!user) {
				toast.error('Você precisa estar autenticado para adicionar uma nota.');
				window.location.href = '/login'; // Redireciona para a página de login
			}
		};

		checkUser();
	}, []);

	const handleFileChange = (selectedFile: File | null) => {
		if (selectedFile) {
			setFile(selectedFile);
			const previewUrl = URL.createObjectURL(selectedFile);
			setImagePreview(previewUrl);
		}
	};

	const uploadImage = async (imageId: string): Promise<string | null> => {
		if (!file) return null; // Retorna null se não houver arquivo

		setIsUploading(true);
		const fileName = `img-${imageId}`;
		const { error } = await supabase.storage
			.from('notes-images')
			.upload(fileName, file);

		if (error) {
			setIsUploading(false);
			toast.error('Erro ao fazer upload da imagem.');
			return null; // Retorna null em caso de erro
		}

		// Obter a URL pública da imagem
		const { data } = supabase.storage
			.from('notes-images')
			.getPublicUrl(fileName);

		console.log('Public URL:', data?.publicUrl);

		setIsUploading(false);
		return data?.publicUrl || null; // Retorna a URL pública ou null
	};

	const isContentEmpty = (content: string) => {
		const trimmedContent = content.trim();
		return trimmedContent === "" || trimmedContent === "<p></p>";
	};

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setIsSaving(true);

		// Verifica se o conteúdo da nota está vazio
		if (isContentEmpty(note)) {
			toast.error('A nota não pode estar vazia.');
			setIsSaving(false);
			return;
		}

		// Criptografar a nota antes de enviar
		const encryptedNote = encryptText(note);

		let uploadedFileURL: string | null = null;

		if (file) {
			uploadedFileURL = await uploadImage(uuidv4());
			if (!uploadedFileURL) {
				setIsSaving(false);
				toast.error('Erro ao fazer upload da imagem.');
				return;
			}
		} else {
			uploadedFileURL = '';
		}

		try {
			const result = await navigate(encryptedNote, params.patient_id, uploadedFileURL);
			setIsSaving(false);

			if (result.success) {
				window.location.href = `/patient-notes/${params.patient_id}`;
			} else {
				toast.error('Erro ao adicionar a nota');
			}
		} catch (error) {
			setIsSaving(false);
			toast.error('Erro ao adicionar a nota');
			console.error('Erro ao adicionar a nota:', error);
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
			.eq('note_id', params.patient_id);
	
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
		<form onSubmit={handleSubmit} className="w-full h-full px-4 sm:px-0 flex flex-col container mx-auto justify-center mt-12">
			<Link
				href={`/patient-notes/${params.patient_id}`}
				className="flex items-center gap-1 hover:gap-3 transition-all"
			>
				<ArrowTopLeftIcon className="w-4 h-4" />
				Voltar
			</Link>
			<div className="flex flex-col items-center gap-1">
				<h1 className="text-3xl mt-10 sm:text-4xl text-center sm:text-left text-orange-900 dark:text-primary font-cabinetGrotesk mb-1">Adicionar Relato de sessão</h1>
				<p className="text-lg text-center sm:text-left mb-8">Escolha o tipo de paciente que deseja adicionar</p>
			</div>

			<div className="w-full sm:w-3/4 mx-auto mb-32 space-y-6">
				<TipTap onChange={setNote} isSaving={isSaving} />
				<ImageUploader
					onFileChange={handleFileChange}
					currentImageUrl={currentImageUrl}
					onRemoveImage={handleRemoveImage}
					imagePreview={imagePreview}
				/>
				<Button
					type="submit"
					className={`mt-4 transition-all duration-300 w-full h-12 ${note ? 'bg-primary' : 'disabled'} ${isSaving || isUploading ? 'bg-orange-700' : 'bg-primary'}`}
					disabled={isSaving || isUploading || isContentEmpty(note)}
				>
					{isSaving || isUploading ? 'Salvando...' : 'Salvar'}
				</Button>
			</div>
		</form>
	);
};

export default AddNote;