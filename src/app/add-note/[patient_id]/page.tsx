"use client"

import { useState } from 'react';
import dynamic from 'next/dynamic';

const Tiptap = dynamic(() => import('@/components/tiptap/editor'), { ssr: false });

const AddNote = ({ params }: { params: { patientID: string } }) => {
	const [note, setNote] = useState('');

	return (
		<div className="w-full h-full flex flex-col container mx-auto justify-center mt-12">
			<h1 className="text-2xl font-medium">Adicionar uma nova nota</h1>

			<div className="w-full h-full flex flex-col justify-center mt-12">
				<p className="">Digite sua nota abaixo:</p>
				<Tiptap onChange={setNote} />
				<button

					type="button"
					className="btn-primary"
				>
					Salvar
				</button>
			</div>
		</div>
	);
};

export default AddNote;