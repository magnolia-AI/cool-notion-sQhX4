"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect } from "react";

interface EditorProps {
  initialContent: string | null;
  onUpdate: (content: string) => void;
  documentId: string;
}

export default function DocumentEditor({ initialContent, onUpdate, documentId }: EditorProps) {
  const editor = useEditor({
    extensions: [StarterKit],
    content: initialContent ? JSON.parse(initialContent) : "",
    editorProps: {
      attributes: {
        class: "prose prose-neutral dark:prose-invert max-w-none focus:outline-none min-h-[500px]",
      },
    },
    onUpdate: ({ editor }) => {
      onUpdate(JSON.stringify(editor.getJSON()));
    },
  });

  useEffect(() => {
    if (editor && initialContent) {
      const currentContent = JSON.stringify(editor.getJSON());
      if (currentContent !== initialContent) {
        editor.commands.setContent(JSON.parse(initialContent));
      }
    }
  }, [documentId, initialContent, editor]);

  return (
    <div className="w-full max-w-3xl mx-auto py-10 px-6">
      <EditorContent editor={editor} />
    </div>
  );
}

