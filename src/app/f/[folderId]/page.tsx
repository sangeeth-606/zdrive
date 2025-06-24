import DriveContents from "./drive-contents";
import { QUERIES } from "~/server/db/queries";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function GoogleDriveClone(props: {
  params: Promise<{ folderId: string }>;
}) {
  const params = await props.params;
  const session = await auth();

  if (!session.userId) {
    redirect("/sign-in");
  }

  const parsedFolderId = parseInt(params.folderId);
  if (isNaN(parsedFolderId)) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-neutral-900 to-neutral-800 p-4 text-white">
        <div className="flex min-h-screen flex-col items-center justify-center">
          <main className="text-center">
            <h1 className="mb-4 bg-gradient-to-r from-red-200 via-red-300 to-red-200 bg-clip-text text-5xl font-bold text-transparent md:text-6xl">
              Invalid Folder
            </h1>
            
            <p className="mx-auto mb-8 max-w-md text-lg text-red-200/80 md:text-xl">
              The folder ID provided is not valid.
            </p>
            
            <a 
              href="/drive"
              className="border border-indigo-500/50 bg-indigo-900/30 text-indigo-100 backdrop-blur-md transition-colors hover:bg-indigo-800/50 px-8 py-3 rounded-lg font-medium inline-block"
            >
              Go to Your Drive
            </a>
          </main>
        </div>
      </div>
    );
  }

  // Check if user owns the folder
  const folder = await QUERIES.getFolderById(parsedFolderId);
  if (!folder || folder.ownerId !== session.userId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-neutral-900 to-neutral-800 p-4 text-white">
        <div className="flex min-h-screen flex-col items-center justify-center">
          <main className="text-center">
            <h1 className="mb-4 bg-gradient-to-r from-red-200 via-red-300 to-red-200 bg-clip-text text-5xl font-bold text-transparent md:text-6xl">
              Access Denied
            </h1>
            
            <p className="mx-auto mb-8 max-w-md text-lg text-red-200/80 md:text-xl">
              You don't have permission to view this folder.
            </p>
            
            <a 
              href="/drive"
              className="border border-indigo-500/50 bg-indigo-900/30 text-indigo-100 backdrop-blur-md transition-colors hover:bg-indigo-800/50 px-8 py-3 rounded-lg font-medium inline-block"
            >
              Go to Your Drive
            </a>
          </main>
        </div>
      </div>
    );
  }

  const [folders, files, parents] = await Promise.all([
    QUERIES.getFolders(parsedFolderId, session.userId),
    QUERIES.getFiles(parsedFolderId, session.userId),
    QUERIES.getAllParentsForFolder(parsedFolderId),
  ]);

  return (
    <DriveContents
      files={files}
      folders={folders}
      parents={parents}
      currentFolderId={parsedFolderId}
    />
  );
}
