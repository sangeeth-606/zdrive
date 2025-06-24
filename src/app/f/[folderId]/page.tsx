

import { z } from "zod"
import { db } from "~/server/db"
import { files_table, folders_table } from "~/server/db/schema"
import { eq } from "drizzle-orm"
import GoogleDriveClone from "../../drive-contents"

export default async function Page(props: { params: Promise<{ folderId: number }> }) {
  const params = await props.params;
  
  const safeParams = z
    .object({
      folderId: z.coerce.number(),
    })
    .parse(params);
  
  // Single optimized query to check if folder exists and get its data
  const folderExists = await db
    .select()
    .from(folders_table)
    .where(eq(folders_table.id, safeParams.folderId))
    .limit(1);

  if (folderExists.length === 0) {
    return (
      <div className="min-h-screen bg-gray-900 text-gray-100 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-400 mb-4">Invalid Folder ID</h1>
            <p className="text-gray-300">The folder you are looking for does not exist.</p>
          </div>
        </div>
      </div>
    );
  }

  // Optimized parallel queries - only get what we need
  const [files, folders] = await Promise.all([
    db.select().from(files_table).where(eq(files_table.parent, safeParams.folderId)),
    db.select().from(folders_table).where(eq(folders_table.parent, safeParams.folderId)),
  ]);

  // Get all folders for breadcrumb navigation (cached/optimized later)
  const allFolders = await db.select().from(folders_table);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <GoogleDriveClone 
          files={files} 
          folders={folders} 
          allFolders={allFolders}
          currentFolderId={safeParams.folderId} 
        />
      </div>
    </div>
  );
} 

//"The Promise type is used because in Next.js App Router, route parameters are delivered asynchronously. Unlike the old Pages Router where params were immediately available, the App Router requires us to await the params. This allows Next.js to handle more complex routing scenarios and maintain better performance. By typing it as Promise and awaiting it, we ensure our code is both type-safe and follows Next.js best practices."

// "The reason we use Promise<{ folderId: number }> is because in Next.js App Router, route parameters are delivered asynchronously. Unlike the old Pages Router where params were immediately available, the App Router requires us to await the params. This allows Next.js to handle more complex routing scenarios and maintain better performance. By typing it as Promise and awaiting it, we ensure our code is both type-safe and follows Next.js best practices."