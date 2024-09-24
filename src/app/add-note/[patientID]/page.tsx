import Tiptap from "@/components/tiptap/editor";
import { Button } from "@/components/ui/button";

const AddNote = () => {
    return (
        <div className="w-full h-full flex flex-col container mx-auto justify-center mt-12">
            <h1 className="text-2xl font-medium">Adicionar uma nova nota</h1>

            <div className="w-full h-full flex flex-col justify-center mt-12">
                <p className="">Digite sua nota abaixo:</p>
                <Tiptap />
                <Button type="submit">Salvar</Button>
            </div>
        </div>
    )
}

export default AddNote;