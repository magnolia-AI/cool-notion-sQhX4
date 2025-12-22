'use client';

import { Document, Workspace } from "@/lib/schema";
import { useState, useCallback } from "react";

// Mock store for persistence simulation without DB
let mockWorkspaces: Workspace[] = [
  {
    id: "ws-1",
    name: "My Workspace",
    userId: "user-1",
    createdAt: new Date(),
    updatedAt: new Date(),
  }
];

let mockDocuments: Document[] = [
  {
    id: "doc-1",
    title: "Getting Started",
    content: JSON.stringify({
      type: "doc",
      content: [{ type: "heading", attrs: { level: 1 }, content: [{ type: "text", text: "Welcome to Notion Clone!" }] }]
    }),
    workspaceId: "ws-1",
    parentDocumentId: null,
    userId: "user-1",
    isArchived: false,
    isPublished: false,
    icon: "🚀",
    coverImage: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  }
];

export function useMockStore() {
  const [documents, setDocuments] = useState<Document[]>(mockDocuments);

  const createDoc = useCallback((workspaceId: string, parentId?: string | null) => {
    const newDoc: Document = {
      id: Math.random().toString(36).substring(7),
      title: "Untitled",
      content: null,
      workspaceId,
      parentDocumentId: parentId || null,
      userId: "user-1",
      isArchived: false,
      isPublished: false,
      icon: null,
      coverImage: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    mockDocuments = [...mockDocuments, newDoc];
    setDocuments(mockDocuments);
    return newDoc;
  }, []);

  const updateDoc = useCallback((id: string, updates: Partial<Document>) => {
    mockDocuments = mockDocuments.map(doc => 
      doc.id === id ? { ...doc, ...updates, updatedAt: new Date() } : doc
    );
    setDocuments(mockDocuments);
  }, []);

  return {
    documents,
    createDoc,
    updateDoc,
    workspaces: mockWorkspaces
  };
}

