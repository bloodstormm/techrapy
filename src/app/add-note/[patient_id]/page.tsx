"use client"

import { useState } from 'react';
import { toast } from 'sonner';
import { navigate } from './actions';
import Link from 'next/link';
import { ArrowTopLeftIcon } from '@radix-ui/react-icons';
import TipTap from '@/components/tiptap/';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabaseClient'; // Certifique-se de que o cliente do Supabase está configurado
import { v4 as uuidv4 } from 'uuid';

const AddNote = ({ params }: { params: { patient_id: string } }) => {
	const [note, setNote] = useState('');
	const [isSaving, setIsSaving] = useState(false);
	const [file, setFile] = useState<File | null>(null);
	const [isUploading, setIsUploading] = useState(false);
	const [imagePreview, setImagePreview] = useState<string | null>(null);

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files && e.target.files[0]) {
			const selectedFile = e.target.files[0];
			setFile(selectedFile);

			// Criar uma URL de objeto para a pré-visualização
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

		let uploadedFileURL: string | null = null;

		if (file) {
			uploadedFileURL = await uploadImage(uuidv4());
			if (!uploadedFileURL) {
				setIsSaving(false);
				toast.error('Erro ao fazer upload da imagem.');
				return;
			}
		} else {
			// Se não houver arquivo, defina uploadedFileURL como uma string vazia
			uploadedFileURL = '';
		}

		// Salvar a nota
		const success = await navigate(note, params.patient_id, uploadedFileURL);
		setIsSaving(false);

		if (success) {
			localStorage.setItem('successMessage', 'Nota e imagem adicionadas com sucesso!');
			window.location.href = `/patient-notes/${params.patient_id}`;
		} else {
			toast.error('Erro ao adicionar a nota.');
		}
	};

	return (
		<form onSubmit={handleSubmit} className="w-full h-full flex flex-col container mx-auto justify-center mt-12">
			<Link
				href={`/patient-notes/${params.patient_id}`}
				className="flex items-center gap-1 hover:gap-3 transition-all"
			>
				<ArrowTopLeftIcon className="w-4 h-4" />
				Voltar
			</Link>
			<div className="flex flex-col items-center gap-1">
				<h1 className="text-4xl font-cabinetGrotesk mb-1">Adicionar Nota</h1>
				<p className="text-lightText text-2xl font-light mb-8">Escolha o tipo de paciente que deseja adicionar</p>
			</div>

			<div className="w-3/4 mx-auto mb-32 space-y-6">
				<TipTap onChange={setNote} isSaving={isSaving} />
				<div className="flex flex-col items-center gap-1 border border-primary p-4 rounded-lg bg-orange-100 dark:bg-gray-950">
					<label htmlFor="image" className="mt-4 block text-xl ">Adicionar Imagem</label>
					<input type="file" className="mt-4 file:flex file:items-center file:justify-center file:w-full file:mb-2 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-orange-700 file:transition-all file:duration-150" id="image" onChange={handleFileChange} />
					{imagePreview && (
						<img src={imagePreview} alt="Pré-visualização da imagem" className="mt-4 max-w-[500px] h-auto rounded-lg" />
					)}
				</div>
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