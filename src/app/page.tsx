import { db } from "~/server/db";
import { files_table, folders_table } from "~/server/db/schema";
import { isNull } from "drizzle-orm";
import GoogleDriveClone from "./drive-contents";

export default async function HomePage() {
  // Single optimized query with joins to reduce round trips
  const [rootData] = await Promise.all([
    Promise.all([
      db.select().from(files_table).where(isNull(files_table.parent)),
      db.select().from(folders_table).where(isNull(folders_table.parent)),
      db.select().from(folders_table), // All folders for breadcrumbs
    ])
  ]);

  const [files, folders, allFolders] = rootData;

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <GoogleDriveClone 
          files={files} 
          folders={folders} 
          allFolders={allFolders}
          currentFolderId={null} 
        />
      </div>
    </div>
  );
}