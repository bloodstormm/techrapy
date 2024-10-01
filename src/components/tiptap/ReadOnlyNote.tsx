import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { useState, useEffect } from 'react'

interface ReadOnlyNoteProps {
  content: string
}

const ReadOnlyNote = ({ content }: ReadOnlyNoteProps) => {
  const [isMounted, setIsMounted] = useState(false)

  const editor = useEditor({
    extensions: [StarterKit],
    content: content,
    editable: false,
  })

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return null
  }

  return <EditorContent editor={editor} />
}

export default ReadOnlyNote