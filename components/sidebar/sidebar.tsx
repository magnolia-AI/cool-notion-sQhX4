"use client";

import { useSidebar } from "@/components/ui/sidebar";
import { 
  Plus, 
  Search, 
  Settings, 
  ChevronRight, 
  ChevronDown,
  FileText,
  MoreHorizontal
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { 
  Sidebar, 
  SidebarContent, 
  SidebarHeader, 
  SidebarMenu, 
  SidebarMenuItem, 
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupAction
} from "@/components/ui/sidebar";
import { Document } from "@/lib/schema";

interface SidebarProps {
  documents: Document[];
  workspaceId: string;
  onAdd: (parentId?: string) => void;
}

export function NotionSidebar({ documents, workspaceId, onAdd }: SidebarProps) {
  const router = useRouter();
  const params = useParams();
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const onExpand = (id: string) => {
    setExpanded(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const rootDocuments = documents.filter(doc => !doc.parentDocumentId);

  return (
    <Sidebar variant="sidebar" collapsible="icon">
      <SidebarHeader className="border-b p-4">
        <div className="flex items-center gap-2 font-semibold">
          <div className="bg-primary text-primary-foreground p-1 rounded flex items-center justify-center w-6 h-6 text-xs">
            NC
          </div>
          <span className="truncate">Notion Clone</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton tooltip="Search">
                <Search className="w-4 h-4" />
                <span>Search</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton tooltip="Settings">
                <Settings className="w-4 h-4" />
                <span>Settings</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton onClick={() => onAdd()} tooltip="New page">
                <Plus className="w-4 h-4" />
                <span>New page</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Documents</SidebarGroupLabel>
          <SidebarGroupAction onClick={() => onAdd()} title="Add page">
            <Plus className="w-4 h-4" />
          </SidebarGroupAction>
          <SidebarMenu>
            {rootDocuments.map(doc => (
              <DocumentItem 
                key={doc.id} 
                document={doc} 
                level={0}
                onExpand={onExpand}
                onAdd={onAdd}
                expanded={expanded[doc.id]}
                allDocuments={documents}
                active={params.documentId === doc.id}
              />
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}

function DocumentItem({ 
  document, 
  level, 
  onExpand, 
  onAdd,
  expanded, 
  allDocuments,
  active
}: { 
  document: Document; 
  level: number; 
  onExpand: (id: string) => void;
  onAdd: (parentId: string) => void;
  expanded?: boolean;
  allDocuments: Document[];
  active?: boolean;
}) {
  const router = useRouter();
  const children = allDocuments.filter(doc => doc.parentDocumentId === document.id);
  
  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    onExpand(document.id);
  };

  return (
    <>
      <SidebarMenuItem>
        <SidebarMenuButton 
          isActive={active}
          onClick={() => router.push(`/documents/${document.id}`)}
          className="group"
          style={{ paddingLeft: `${(level * 12) + 12}px` }}
        >
          <div 
            onClick={handleToggle}
            className="flex items-center justify-center rounded-sm hover:bg-neutral-200 dark:hover:bg-neutral-800 p-1 mr-1"
          >
            {children.length > 0 ? (
              expanded ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />
            ) : <div className="w-3" />}
          </div>
          {document.icon ? (
            <span className="shrink-0 mr-2">{document.icon}</span>
          ) : (
            <FileText className="shrink-0 h-4 w-4 mr-2" />
          )}
          <span className="truncate">{document.title}</span>
          <div className="ml-auto opacity-0 group-hover:opacity-100 flex items-center gap-x-1">
             <div 
               role="button"
               onClick={(e) => {
                 e.stopPropagation();
                 onAdd(document.id);
               }}
               className="hover:bg-neutral-200 dark:hover:bg-neutral-800 rounded-sm p-0.5"
             >
               <Plus className="h-3.5 w-3.5 text-muted-foreground" />
             </div>
             <div className="hover:bg-neutral-200 dark:hover:bg-neutral-800 rounded-sm p-0.5">
               <MoreHorizontal className="h-3.5 w-3.5 text-muted-foreground" />
             </div>
          </div>
        </SidebarMenuButton>
      </SidebarMenuItem>
      {expanded && children.length > 0 && (
        children.map(child => (
          <DocumentItem 
            key={child.id} 
            document={child} 
            level={level + 1}
            onExpand={onExpand}
            onAdd={onAdd}
            expanded={expanded}
            allDocuments={allDocuments}
          />
        ))
      )}
    </>
  );
}

