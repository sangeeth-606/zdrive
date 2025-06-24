import { SignInButton } from "@clerk/nextjs";

export default function HomePage() {
  return (
    <>
      <h1 className="mb-4 bg-gradient-to-r from-indigo-200 via-purple-200 to-blue-200 bg-clip-text text-5xl font-bold text-transparent md:text-6xl">
        Welcome Back
      </h1>
      
      <p className="mx-auto mb-12 max-w-md text-lg text-indigo-200/80 md:text-xl">
        Sign in to access your files and continue where you left off.
      </p>
      
      <div className="mb-12 flex flex-col items-center justify-center space-y-4">
        <SignInButton 
          forceRedirectUrl={"/drive"}
          mode="modal"
        >
          <button className="border border-indigo-500/50 bg-indigo-900/30 text-indigo-100 backdrop-blur-md transition-all duration-200 hover:bg-indigo-800/50 hover:border-indigo-400/60 hover:scale-105 px-12 py-4 rounded-lg font-medium text-lg shadow-lg hover:shadow-indigo-500/20">
            Sign In to Continue
          </button>
        </SignInButton>
        
        <p className="text-xs text-indigo-200/50 max-w-xs text-center">
          Secure access to your personal cloud storage
        </p>
      </div>
      
      <footer className="mt-20 text-sm text-indigo-200/60">
        © {new Date().getFullYear()} zDrive. All rights reserved.
      </footer>
    </>
  );
}
