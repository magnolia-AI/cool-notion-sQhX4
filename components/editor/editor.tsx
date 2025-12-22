"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect, useState } from "react";
import { Document } from "@/lib/schema";
import { Input } from "@/components/ui/input";

interface EditorProps {
  initialDocument: Document;
  onUpdate: (values: Partial<Document>) => void;
}

export default function DocumentEditor({ initialDocument, onUpdate }: EditorProps) {
  const [title, setTitle] = useState(initialDocument.title);

  const editor = useEditor({
    extensions: [StarterKit],
    content: initialDocument.content ? JSON.parse(initialDocument.content) : "",
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: "prose prose-neutral dark:prose-invert max-w-none focus:outline-none min-h-[500px]",
      },
    },
    onUpdate: ({ editor }) => {
      onUpdate({ content: JSON.stringify(editor.getJSON()) });
    },
  });

  const onTitleChange = (newTitle: string) => {
    setTitle(newTitle);
    onUpdate({ title: newTitle });
  };

  return (
    <div className="w-full max-w-3xl mx-auto py-10 px-6 space-y-4">
      <Input
        value={title}
        onChange={(e) => onTitleChange(e.target.value)}
        className="text-4xl font-bold border-none bg-transparent h-auto p-0 focus-visible:ring-0 placeholder:text-neutral-300 dark:placeholder:text-neutral-700"
        placeholder="Untitled"
      />
      <div className="border-t pt-4">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}

