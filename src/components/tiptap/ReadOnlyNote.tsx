import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Highlight from '@tiptap/extension-highlight';
import { useState, useEffect } from 'react';

interface ReadOnlyNoteProps {
  content: string;
  className?: string;
}

const ReadOnlyNote = ({ content, className }: ReadOnlyNoteProps) => {
  const [isMounted, setIsMounted] = useState(false);

  const editor = useEditor({
    extensions: [StarterKit, Highlight],
    content: content,
    editable: false,
    immediatelyRender: false
  });

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (editor && content) {
      editor.commands.setContent(content);
    }
  }, [editor, content]);

  if (!isMounted) {
    return null;
  }

  return <EditorContent editor={editor} className={className} />;
};

export default ReadOnlyNote;