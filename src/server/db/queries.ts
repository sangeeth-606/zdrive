import "server-only";

import { db } from "~/server/db";
import {
  files_table as filesSchema,
  folders_table as foldersSchema,
  type DB_FileType,
} from "~/server/db/schema";
import { eq, isNull, and, inArray } from "drizzle-orm";
import { UTApi } from "uploadthing/server";

export const QUERIES = {
  getFolders: function (folderId: number, userId: string) {
    return db
      .select()
      .from(foldersSchema)
      .where(
        and(
          eq(foldersSchema.parent, folderId),
          eq(foldersSchema.ownerId, userId)
        )
      )
      .orderBy(foldersSchema.id);
  },
  getFiles: function (folderId: number, userId: string) {
    return db
      .select()
      .from(filesSchema)
      .where(
        and(
          eq(filesSchema.parent, folderId),
          eq(filesSchema.ownerId, userId)
        )
      )
      .orderBy(filesSchema.id);
  },
  getAllParentsForFolder: async function (folderId: number) {
    const parents = [];
    let currentId: number | null = folderId;
    while (currentId !== null) {
      const folder = await db
        .selectDistinct()
        .from(foldersSchema)
        .where(eq(foldersSchema.id, currentId));

      if (!folder[0]) {
        throw new Error("Parent folder not found");
      }
      parents.unshift(folder[0]);
      currentId = folder[0]?.parent;
    }
    return parents;
  },
  getFolderById: async function (folderId: number) {
    const folder = await db
      .select()
      .from(foldersSchema)
      .where(eq(foldersSchema.id, folderId));
    return folder[0];
  },

  getRootFolderForUser: async function (userId: string) {
    const folder = await db
      .select()
      .from(foldersSchema)
      .where(
        and(eq(foldersSchema.ownerId, userId), isNull(foldersSchema.parent)),
      );
    return folder[0];
  },

  getAllChildFolders: async function (folderId: number): Promise<number[]> {
    const allFolderIds: number[] = [folderId];
    const toProcess: number[] = [folderId];
    
    while (toProcess.length > 0) {
      const currentId = toProcess.shift()!;
      const childFolders = await db
        .select({ id: foldersSchema.id })
        .from(foldersSchema)
        .where(eq(foldersSchema.parent, currentId));
      
      for (const folder of childFolders) {
        allFolderIds.push(folder.id);
        toProcess.push(folder.id);
      }
    }
    
    return allFolderIds;
  },

  getAllFilesInFolders: async function (folderIds: number[]) {
    if (folderIds.length === 0) return [];
    
    return await db
      .select()
      .from(filesSchema)
      .where(inArray(filesSchema.parent, folderIds));
  },
};

export const MUTATIONS = {
  createFile: async function (input: {
    file: {
      name: string;
      size: number;
      url: string;
      parent: number;
    };
    userId: string;
  }) {
    return await db.insert(filesSchema).values({
      ...input.file,
      ownerId: input.userId,
    });
  },

  onboardUser: async function (userId: string) {
    const rootFolder = await db
      .insert(foldersSchema)
      .values({
        name: "Root",
        parent: null,
        ownerId: userId,
      })
      .$returningId();

    const rootFolderId = rootFolder[0]!.id;

    await db.insert(foldersSchema).values([
      {
        name: "Trash",
        parent: rootFolderId,
        ownerId: userId,
      },
      {
        name: "Shared",
        parent: rootFolderId,
        ownerId: userId,
      },
      {
        name: "Documents",
        parent: rootFolderId,
        ownerId: userId,
      },
    ]);

    return rootFolderId;
  },

  deleteFolder: async function (folderId: number, userId: string) {
    // Get all child folders recursively
    const allFolderIds = await QUERIES.getAllChildFolders(folderId);
    
    // Get all files in these folders
    const allFiles = await QUERIES.getAllFilesInFolders(allFolderIds);
    
    // Delete files from uploadthing
    const utApi = new UTApi();
    if (allFiles.length > 0) {
      const fileKeys = allFiles.map(file => 
        file.url.replace("https://utfs.io/f/", "")
      );
      await utApi.deleteFiles(fileKeys);
    }
    
    // Delete files from database
    if (allFiles.length > 0) {
      await db
        .delete(filesSchema)
        .where(inArray(filesSchema.id, allFiles.map(f => f.id)));
    }
    
    // Delete folders from database (in reverse order to handle parent-child relationships)
    for (const id of allFolderIds.reverse()) {
      await db
        .delete(foldersSchema)
        .where(and(
          eq(foldersSchema.id, id),
          eq(foldersSchema.ownerId, userId)
        ));
    }
    
    return { success: true };
  },
};
