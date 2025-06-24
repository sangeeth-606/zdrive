import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { mockFolders } from "~/lib/mock-data";
import { db } from "~/server/db";
import { folders_table } from "~/server/db/schema";

export default async function Sandbox() {
  const user = await auth();
  if (!user.userId) {
    throw new Error("User not found");
  }

  const folders = await db
    .select()
    .from(folders_table)
    .where(eq(folders_table.ownerId, user.userId));

  console.log(folders);

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-neutral-900 to-neutral-800 p-4 text-white">
      <div className="flex min-h-screen flex-col items-center justify-center">
        <main className="text-center">
          <h1 className="mb-4 bg-gradient-to-r from-indigo-200 via-purple-200 to-blue-200 bg-clip-text text-5xl font-bold text-transparent md:text-6xl">
            Developer Sandbox
          </h1>
          
          <p className="mx-auto mb-8 max-w-md text-lg text-indigo-200/80 md:text-xl">
            Testing area for development and debugging.
          </p>
          
          <form
            action={async () => {
              "use server";
              const user = await auth();
              if (!user.userId) {
                throw new Error("User not found");
              }

              const rootFolder = await db
                .insert(folders_table)
                .values({
                  name: "root",
                  ownerId: user.userId,
                  parent: null,
                })
                .$returningId();

              const insertableFolders = mockFolders.map((folder) => ({
                name: folder.name,
                ownerId: user.userId,
                parent: rootFolder[0]!.id,
              }));
              await db.insert(folders_table).values(insertableFolders);
            }}
          >
            <button 
              type="submit"
              className="border border-indigo-500/50 bg-indigo-900/30 text-indigo-100 backdrop-blur-md transition-colors hover:bg-indigo-800/50 px-8 py-3 rounded-lg font-medium"
            >
              Create Test Files
            </button>
          </form>
        </main>
      </div>
    </div>
  );
}
