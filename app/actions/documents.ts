"use server";

import db from "@/lib/db";
import { documents, workspaces, type Document, type Workspace, type NewDocument } from "@/lib/schema";
import { eq, and, asc } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { type ActionResult } from "@/app/types/actions";

const DEFAULT_USER_ID = "user_default";

export async function getOrCreateWorkspace(): Promise<ActionResult<Workspace>> {
  try {
    const existing = await db.select().from(workspaces).where(eq(workspaces.userId, DEFAULT_USER_ID)).limit(1);
    
    if (existing.length > 0) {
      return { success: true, data: existing[0] };
    }

    const [newWorkspace] = await db.insert(workspaces).values({
      name: "Personal Workspace",
      userId: DEFAULT_USER_ID,
    }).returning();

    return { success: true, data: newWorkspace };
  } catch (error) {
    console.error("Failed to get workspace:", error);
    return { success: false, error: "Failed to load workspace" };
  }
}

export async function getDocuments(workspaceId: string): Promise<ActionResult<Document[]>> {
  try {
    const docs = await db.select()
      .from(documents)
      .where(and(eq(documents.workspaceId, workspaceId), eq(documents.isArchived, false)))
      .orderBy(asc(documents.createdAt));
    
    return { success: true, data: docs };
  } catch (error) {
    console.error("Failed to fetch documents:", error);
    return { success: false, error: "Failed to load documents" };
  }
}

export async function createDocument(workspaceId: string, parentDocumentId?: string): Promise<ActionResult<Document>> {
  try {
    const [newDoc] = await db.insert(documents).values({
      title: "Untitled",
      workspaceId,
      parentDocumentId: parentDocumentId || null,
      userId: DEFAULT_USER_ID,
      content: "",
    }).returning();

    revalidatePath("/");
    return { success: true, data: newDoc };
  } catch (error) {
    console.error("Failed to create document:", error);
    return { success: false, error: "Failed to create document" };
  }
}

export async function updateDocument(id: string, values: Partial<Document>): Promise<ActionResult<Document>> {
  try {
    const [updatedDoc] = await db.update(documents)
      .set({
        ...values,
        updatedAt: new Date(),
      })
      .where(eq(documents.id, id))
      .returning();

    revalidatePath("/");
    return { success: true, data: updatedDoc };
  } catch (error) {
    console.error("Failed to update document:", error);
    return { success: false, error: "Failed to save changes" };
  }
}

export async function archiveDocument(id: string): Promise<ActionResult<void>> {
  try {
    await db.update(documents)
      .set({ isArchived: true, updatedAt: new Date() })
      .where(eq(documents.id, id));

    revalidatePath("/");
    return { success: true, data: undefined };
  } catch (error) {
    console.error("Failed to archive document:", error);
    return { success: false, error: "Failed to archive document" };
  }
}

