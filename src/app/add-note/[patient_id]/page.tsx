"use client"

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { navigate } from './actions';
import Link from 'next/link';
import { ArrowTopLeftIcon } from '@radix-ui/react-icons';
import TipTap from '@/components/tiptap/';

const AddNote = ({ params }: { params: { patient_id: string } }) => {
	const [note, setNote] = useState('');
	const [isSaving, setIsSaving] = useState(false);

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setIsSaving(true);
		const success = await navigate(note, params.patient_id);
		setIsSaving(false);
		if (success) {
			localStorage.setItem('successMessage', 'Nota adicionada com sucesso!');
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
			<h1 className="text-2xl font-medium">Adicionar uma nova nota</h1>


			<div className="w-full h-full flex flex-col justify-center mt-12">
				<p className="">Digite sua nota abaixo:</p>
				<TipTap onChange={setNote} />
				<Button
					type="submit"
					className="btn-primary"
					disabled={isSaving}
				>
					{isSaving ? 'Salvando...' : 'Salvar'}
				</Button>
			</div>
		</form>
	);
};

export default AddNote;