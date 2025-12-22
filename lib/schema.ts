import { pgTable, serial, varchar, text, timestamp, boolean, uuid } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Fallback Mock Data Types
export interface Workspace {
  id: string;
  name: string;
  userId: string;
  icon?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Document {
  id: string;
  title: string;
  content: string | null;
  workspaceId: string;
  parentDocumentId: string | null;
  userId: string;
  isArchived: boolean;
  isPublished: boolean;
  icon: string | null;
  coverImage: string | null;
  createdAt: Date;
  updatedAt: Date;
}

