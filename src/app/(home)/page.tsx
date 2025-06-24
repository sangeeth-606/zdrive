import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Button } from "~/components/ui/button";

export default function HomePage() {
  return (
    <>
      <h1 className="mb-4 bg-gradient-to-r from-indigo-200 via-purple-200 to-blue-200 bg-clip-text text-5xl font-bold text-transparent md:text-6xl">
        zDrive
      </h1>
      
      <p className="mx-auto mb-8 max-w-md text-lg text-indigo-200/80 md:text-xl">
        Access your files anywhere, anytime—simple and reliable cloud storage.
      </p>
      <form
        action={async () => {
          "use server";

          const session = await auth();

          if (!session.userId) {
            return redirect("/sign-in");
          }

          return redirect("/drive");
        }}
      >
        <Button
          size="lg"
          type="submit"
          className="border border-indigo-500/50 bg-indigo-900/30 text-indigo-100 backdrop-blur-md transition-colors hover:bg-indigo-800/50"
        >
          Get Started
        </Button>
      </form>
    </>
  );
}