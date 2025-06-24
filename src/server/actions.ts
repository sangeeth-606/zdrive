"use server";

import { and, eq } from "drizzle-orm";
import { db } from "./db";
import { files_table, folders_table } from "./db/schema";
import { auth } from "@clerk/nextjs/server";
import { UTApi } from "uploadthing/server";
import { cookies } from "next/headers";
import { MUTATIONS } from "./db/queries";

const utApi = new UTApi();

export async function deleteFile(fileId: number) {
  const session = await auth();
  if (!session.userId) {
    return { error: "Unauthorized" };
  }

  const [file] = await db
    .select()
    .from(files_table)
    .where(
      and(eq(files_table.id, fileId), eq(files_table.ownerId, session.userId)),
    );

  if (!file) {
    return { error: "File not found" };
  }

  const utapiResult = await utApi.deleteFiles([
    file.url.replace("https://utfs.io/f/", ""),
  ]);

  console.log(utapiResult);

  const dbDeleteResult = await db
    .delete(files_table)
    .where(eq(files_table.id, fileId));

  console.log(dbDeleteResult);

  const c = await cookies();

  c.set("force-refresh", JSON.stringify(Math.random()));

  return { success: true };
}

export async function createFolder(name: string, parentId: number | null) {
  const session = await auth();
  if (!session.userId) {
    return { error: "Unauthorized" };
  }

  // Validate parent folder exists and user owns it
  if (parentId !== null) {
    const parentFolder = await db
      .select()
      .from(folders_table)
      .where(
        and(
          eq(folders_table.id, parentId),
          eq(folders_table.ownerId, session.userId)
        )
      );

    if (!parentFolder[0]) {
      return { error: "Parent folder not found or unauthorized" };
    }
  }

  try {
    const newFolder = await db
      .insert(folders_table)
      .values({
        name: name.trim(),
        parent: parentId,
        ownerId: session.userId,
      })
      .$returningId();

    const c = await cookies();
    c.set("force-refresh", JSON.stringify(Math.random()));

    return { success: true, folderId: newFolder[0]!.id };
  } catch (error) {
    console.error("Error creating folder:", error);
    return { error: "Failed to create folder" };
  }
}

export async function deleteFolderAction(folderId: number) {
  const session = await auth();
  if (!session.userId) {
    return { error: "Unauthorized" };
  }

  // Check if user owns the folder
  const [folder] = await db
    .select()
    .from(folders_table)
    .where(
      and(
        eq(folders_table.id, folderId),
        eq(folders_table.ownerId, session.userId)
      )
    );

  if (!folder) {
    return { error: "Folder not found or unauthorized" };
  }

  try {
    await MUTATIONS.deleteFolder(folderId, session.userId);
    
    const c = await cookies();
    c.set("force-refresh", JSON.stringify(Math.random()));

    return { success: true };
  } catch (error) {
    console.error("Error deleting folder:", error);
    return { error: "Failed to delete folder" };
  }
}
