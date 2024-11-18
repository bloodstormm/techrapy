"use client";
import React from "react";
import {
  Bold,
  Strikethrough,
  Italic,
  List,
  ListOrdered,
  Heading2,
  Underline,
  Quote,
  Undo,
  Redo,
  Code,
} from "lucide-react";

type MenuBarProps = {
  editor: any;
  content: string;
  isContentEmpty: boolean;
  isSaving: boolean; // Adicione esta linha
};

const MenuBar = ({ editor, content, isContentEmpty, isSaving }: MenuBarProps) => {
  if (!editor) {
    return null;
  }
  return (
    <div
      className="px-4 py-3 h-full xl:h-20 border-b border-orange-700 dark:border-foreground/30 xl:gap-5 flex justify-between items-center
    gap-2 w-full flex-wrap"
    >
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <button
          onClick={(e) => {
            e.preventDefault();
            editor.chain().focus().toggleBold().run();
          }}
          className={
            editor.isActive("bold")
              ? "bg-orange-700 text-white p-1 rounded-lg"
              : "text-orange-400 p-1"
          }
        >
          <Bold className="w-5 h-5" />
        </button>
        <button
          onClick={(e) => {
            e.preventDefault();
            editor.chain().focus().toggleItalic().run();
          }}
          className={
            editor.isActive("italic")
              ? "bg-orange-700 text-white p-1 rounded-lg"
              : "text-orange-400 p-1"
          }
        >
          <Italic className="w-5 h-5" />
        </button>

        <button
          onClick={(e) => {
            e.preventDefault();
            editor.chain().focus().toggleUnderline().run();
          }}
          className={
            editor.isActive("underline")
              ? "bg-orange-700 text-white p-1 rounded-lg"
              : "text-orange-400 p-1"
          }
        >
          <Underline className="w-5 h-5" />
        </button>
        <button
          onClick={(e) => {
            e.preventDefault();
            editor.chain().focus().toggleStrike().run();
          }}
          className={
            editor.isActive("strike")
              ? "bg-orange-700 text-white p-1 rounded-lg"
              : "text-orange-400 p-1"
          }
        >
          <Strikethrough className="w-5 h-5" />
        </button>
        <button
          onClick={(e) => {
            e.preventDefault();
            editor.chain().focus().toggleHeading({ level: 2 }).run();
          }}
          className={
            editor.isActive("heading", { level: 2 })
              ? "bg-orange-700 text-white p-1 rounded-lg"
              : "text-orange-400 p-1"
          }
        >
          <Heading2 className="w-5 h-5" />
        </button>

        <button
          onClick={(e) => {
            e.preventDefault();
            editor.chain().focus().toggleBulletList().run();
          }}
          className={
            editor.isActive("bulletList")
              ? "bg-orange-700 text-white p-1 rounded-lg"
              : "text-orange-400 p-1"
          }
        >
          <List className="w-5 h-5" />
        </button>
        <button
          onClick={(e) => {
            e.preventDefault();
            editor.chain().focus().toggleOrderedList().run();
          }}
          className={
            editor.isActive("orderedList")
              ? "bg-orange-700 text-white p-1 rounded-lg"
              : "text-orange-400 p-1"
          }
        >
          <ListOrdered className="w-5 h-5" />
        </button>
        <button
          onClick={(e) => {
            e.preventDefault();
            editor.chain().focus().toggleBlockquote().run();
          }}
          className={
            editor.isActive("blockquote")
              ? "bg-orange-700 text-white p-1 rounded-lg"
              : "text-orange-400 p-1"
          }
        >
          <Quote className="w-5 h-5" />
        </button>
        <button
          onClick={(e) => {
            e.preventDefault();
            editor.chain().focus().setCode().run();
          }}
          className={
            editor.isActive("code")
              ? "bg-orange-700 text-white p-1 rounded-lg"
              : "text-orange-400 p-1"
          }
        >
          <Code className="w-5 h-5" />
        </button>
        <button
          onClick={(e) => {
            e.preventDefault();
            editor.chain().focus().undo().run();
          }}
          className={
            editor.isActive("undo")
              ? "bg-orange-700 text-white p-1 rounded-lg"
              : "text-orange-400 hover:bg-orange-700 hover:text-white p-1 hover:rounded-lg"
          }
        >
          <Undo className="w-5 h-5" />
        </button>
        <button
          onClick={(e) => {
            e.preventDefault();
            editor.chain().focus().redo().run();
          }}
          className={
            editor.isActive("redo")
              ? "bg-orange-700 text-white p-1 rounded-lg"
              : "text-orange-400 hover:bg-orange-700 hover:text-white p-1 hover:rounded-lg"
          }
        >
          <Redo className="w-5 h-5" />
        </button>
      </div>
    </div>

  );
};

export default MenuBar;