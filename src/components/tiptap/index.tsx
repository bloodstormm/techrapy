"use client";

import React from "react";

import CharacterCount from "@tiptap/extension-character-count";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import underline from "@tiptap/extension-underline";

import MenuBar from "./MenuBar";

type EditorProps = {
  content?: string;
  placeholder?: string;
  onChange: (content: string) => void;
};

export default ({ content = "", placeholder = "", onChange }: EditorProps) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      CharacterCount.configure({
        limit: 10000,
      }),
      Placeholder.configure({
        placeholder,
      }),
      underline,
    ],
    content,
    onUpdate: ({ editor, transaction }) => {
      onChange(editor.getHTML());
    },
  });

  return (
    <div className="w-full editor p-3 h-full">
      {editor && <MenuBar editor={editor} content={content} />}
      <EditorContent editor={editor} />
    </div>
  );
};