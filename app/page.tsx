"use client";

import { useState, useEffect } from "react";
import { NotionSidebar } from "@/components/sidebar/sidebar";
import DocumentEditor from "@/components/editor/editor";
import { 
  getOrCreateWorkspace, 
  getDocuments, 
  createDocument, 
  updateDocument 
} from "@/app/actions/documents";
import { Document, Workspace } from "@/lib/schema";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function NotionClone() {
  const [workspace, setWorkspace] = useState<Workspace | null>(null);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Initial load
  useEffect(() => {
    const init = async () => {
      const workspaceRes = await getOrCreateWorkspace();
      if (workspaceRes.success) {
        setWorkspace(workspaceRes.data);
        const docsRes = await getDocuments(workspaceRes.data.id);
        if (docsRes.success) {
          setDocuments(docsRes.data);
          if (docsRes.data.length > 0) {
            setActiveId(docsRes.data[0].id);
          }
        }
      } else {
        toast.error("Failed to connect to database");
      }
      setLoading(false);
    };
    init();
  }, []);

  const onAdd = async (parentId?: string) => {
    if (!workspace) return;
    
    const res = await createDocument(workspace.id, parentId);
    if (res.success) {
      setDocuments(prev => [...prev, res.data]);
      setActiveId(res.data.id);
      toast.success("Page created");
    } else {
      toast.error("Failed to create page");
    }
  };

  const onUpdate = async (id: string, values: Partial<Document>) => {
    // Optimistic update
    setDocuments(prev => prev.map(doc => 
      doc.id === id ? { ...doc, ...values } : doc
    ));

    const res = await updateDocument(id, values);
    if (!res.success) {
      toast.error("Failed to save changes");
      // Recovery logic could go here (fetching fresh data)
    }
  };

  const activeDocument = documents.find(doc => doc.id === activeId);

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full bg-background overflow-hidden">
        <NotionSidebar 
          documents={documents}
          workspaceId={workspace?.id || ""}
          onAdd={onAdd}
          onSelect={setActiveId}
          activeId={activeId}
        />
        <main className="flex-1 overflow-y-auto w-full">
          {activeDocument ? (
            <DocumentEditor 
              key={activeDocument.id}
              initialDocument={activeDocument}
              onUpdate={(values) => onUpdate(activeDocument.id, values)}
            />
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-muted-foreground space-y-4">
              <div className="bg-neutral-100 dark:bg-neutral-900 p-4 rounded-full">
                <Loader2 className="h-10 w-10 text-neutral-400" />
              </div>
              <h2 className="text-xl font-medium text-foreground">Select or create a page</h2>
              <p className="text-sm max-w-xs text-center">
                Choose a document from the sidebar to start writing, or create a new one to get organized.
              </p>
              <button 
                onClick={() => onAdd()}
                className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors"
              >
                Create first page
              </button>
            </div>
          )}
        </main>
      </div>
    </SidebarProvider>
  );
}

