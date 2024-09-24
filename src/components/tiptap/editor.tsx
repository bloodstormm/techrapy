'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import Placeholder from '@tiptap/extension-placeholder'
import StarterKit from '@tiptap/starter-kit'

const Tiptap = () => {
    const editor = useEditor({
        extensions: [
          StarterKit,
          Placeholder.configure({
            placeholder: 'Comece digitando sua nota aqui...',
          })
        ],
        editorProps: {
          attributes: {
            class: 'prose prose-sm sm:prose-base lg:prose-lg xl:prose-2xl my-5 focus:outline-none border border-orange-400 p-4 min-h-52 rounded-xl',
          },
        },
        content: ``,
        
      })

    const json = editor?.getJSON()

    console.log(json)



  return <EditorContent editor={editor} />
}

export default Tiptap