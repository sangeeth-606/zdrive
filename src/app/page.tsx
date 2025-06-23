
import "server-only"
import { db } from "~/server/db"
import { files_table, folders_table } from "~/server/db/schema"
import GoogleDriveClone from "./drive-contents"

export default async function Page() {
  const files = await db.select().from(files_table);
  const folders = await db.select().from(folders_table);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <GoogleDriveClone files={files} folders={folders} />
      </div>
    </div>
  );
} 