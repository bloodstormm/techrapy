"use client";

import React, { useState } from "react";

import CharacterCount from "@tiptap/extension-character-count";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import underline from "@tiptap/extension-underline";

import MenuBar from "./MenuBar";
import Heading from "@tiptap/extension-heading";

type EditorProps = {
  content?: string;
  onChange: (content: string) => void;
  isSaving?: boolean;
};

export default ({ content = "", onChange, isSaving }: EditorProps & { isSaving: boolean }) => {
  const [currentContent, setCurrentContent] = useState(content);

  const editor = useEditor({
    extensions: [
      StarterKit,
      CharacterCount.configure({
        limit: 10000,
      }),
      Placeholder.configure({
        placeholder: "Comece aqui digitando...",
      }),
      Heading.configure({
        levels: [1, 2, 3],
      }),
      underline,
    ],
    content,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose-base lg:prose-lg xl:prose-2xl focus:outline-none px-4 min-h-52',
      },
    },
    onUpdate: ({ editor, transaction }) => {
      const newContent = editor.getHTML();
      setCurrentContent(newContent);
      onChange(newContent);
    },
  });

  const isContentEmpty = (content: string) => {
    const trimmedContent = content.trim();
    return trimmedContent === "" || trimmedContent === "<p></p>";
  };

  return (
    <div className="w-full mt-2 editor border border-orange-700 rounded-xl focus:outline-non h-full">
      {editor && <MenuBar editor={editor} content={currentContent} isContentEmpty={isContentEmpty(currentContent)} isSaving={isSaving} />}
      <EditorContent editor={editor} />
    </div>
  );
};