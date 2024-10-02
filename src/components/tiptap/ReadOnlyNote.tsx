import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { useState, useEffect } from 'react'

interface ReadOnlyNoteProps {
  content: string
  className?: string
}

const ReadOnlyNote = ({ content, className }: ReadOnlyNoteProps) => {
  const [isMounted, setIsMounted] = useState(false)

  const editor = useEditor({
    extensions: [StarterKit],
    content: content,
    editable: false,
    immediatelyRender: false,
  })

  useEffect(() => {
    setIsMounted(true)
  }, [])
  

  if (!isMounted) {
    return null
    
  }
  

  return <EditorContent editor={editor} className={className} />
}

export default ReadOnlyNote