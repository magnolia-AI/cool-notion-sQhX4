"use client";

import { useMockStore } from "@/hooks/use-mock-store";
import { NotionSidebar } from "@/components/sidebar/sidebar";
import DocumentEditor from "@/components/editor/editor";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";

export default function NotionClone() {
  const { documents, createDoc, updateDoc } = useMockStore();
  // Initialize with the first document id
  const [activeId, setActiveId] = useState<string | null>(null);
  const [title, setTitle] = useState("");

  // Handle initial load of documents
  useEffect(() => {
    if (!activeId && documents.length > 0) {
      setActiveId(documents[0].id);
    }
  }, [documents, activeId]);

  const currentDoc = documents.find(doc => doc.id === activeId);

  // Sync title state when active document changes
  useEffect(() => {
    if (currentDoc) {
      setTitle(currentDoc.title);
    } else {
      setTitle("");
    }
  }, [activeId, currentDoc]);

  const handleAdd = (parentId?: string | null) => {
    const newDoc = createDoc("ws-1", parentId);
    setActiveId(newDoc.id);
  };

  const onUpdateTitle = (newTitle: string) => {
    setTitle(newTitle);
    if (activeId) {
      updateDoc(activeId, { title: newTitle || "Untitled" });
    }
  };

  const handleSelectDocument = (id: string) => {
    setActiveId(id);
  };

  return (
    <SidebarProvider>
      <NotionSidebar 
        documents={documents} 
        workspaceId="ws-1" 
        onAdd={handleAdd}
        onSelect={handleSelectDocument}
        activeId={activeId}
      />
      <main className="flex-1 overflow-y-auto bg-background min-h-screen">
        <div className="flex items-center p-4 border-b gap-x-2">
          <SidebarTrigger />
          <div className="h-4 w-[1px] bg-neutral-200 dark:bg-neutral-800 mx-2" />
          <span className="text-sm font-medium text-muted-foreground truncate">
            {currentDoc?.title || "Select a page"}
          </span>
        </div>
        
        {currentDoc ? (
          <div className="flex flex-col">
            <div className="w-full max-w-3xl mx-auto px-6 pt-20">
              <Input
                value={title}
                onChange={(e) => onUpdateTitle(e.target.value)}
                placeholder="Untitled"
                className="text-5xl font-bold border-none focus-visible:ring-0 px-0 h-auto bg-transparent placeholder:opacity-50"
              />
            </div>
            <DocumentEditor 
              key={activeId} // CRITICAL: Reset editor component when document changes
              documentId={currentDoc.id}
              initialContent={currentDoc.content} 
              onUpdate={(content) => updateDoc(currentDoc.id, { content })}
            />
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-[80vh] text-muted-foreground">
            <p className="text-lg">Select a page or create a new one to get started.</p>
          </div>
        )}
      </main>
    </SidebarProvider>
  );
}

