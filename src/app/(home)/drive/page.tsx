import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Button } from "~/components/ui/button";
import { MUTATIONS, QUERIES } from "~/server/db/queries";

export default async function DrivePage() {
  const session = await auth();

  if (!session.userId) {
    return redirect("/sign-in");
  }

  const rootFolder = await QUERIES.getRootFolderForUser(session.userId);

  if (!rootFolder) {
    return (
      <>
        <h1 className="mb-4 bg-gradient-to-r from-indigo-200 via-purple-200 to-blue-200 bg-clip-text text-5xl font-bold text-transparent md:text-6xl">
          Setup Your Drive
        </h1>
        
        <p className="mx-auto mb-8 max-w-md text-lg text-indigo-200/80 md:text-xl">
          Let&apos;s create your personal cloud storage space.
        </p>
        
        <form
          action={async () => {
            "use server";
            const session = await auth();

            if (!session.userId) {
              return redirect("/sign-in");
            }

            const rootFolderId = await MUTATIONS.onboardUser(session.userId);

            return redirect(`/f/${rootFolderId}`);
          }}
        >
          <Button 
            size="lg"
            className="border border-indigo-500/50 bg-indigo-900/30 text-indigo-100 backdrop-blur-md transition-colors hover:bg-indigo-800/50"
          >
            Create Your Drive
          </Button>
        </form>
      </>
    );
  }

  return redirect(`/f/${rootFolder.id}`);
}
