"use client";

import { Upload, ChevronRight, Plus, FolderPlus } from "lucide-react";
import { FileRow, FolderRow } from "./file-row";
import type { files_table, folders_table } from "~/server/db/schema";
import Link from "next/link";
import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { UploadButton } from "~/components/uploadthing";
import { useRouter } from "next/navigation";
import { usePostHog } from "posthog-js/react";
import { Button } from "~/components/ui/button";
import { createFolder } from "~/server/actions";
import { useState } from "react";

export default function DriveContents(props: {
  files: (typeof files_table.$inferSelect)[];
  folders: (typeof folders_table.$inferSelect)[];
  parents: (typeof folders_table.$inferSelect)[];

  currentFolderId: number;
}) {
  const navigate = useRouter();
  const posthog = usePostHog();
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");

  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) return;
    
    const result = await createFolder(newFolderName, props.currentFolderId);
    if (result.success) {
      setNewFolderName("");
      setIsCreatingFolder(false);
      navigate.refresh();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-neutral-900 to-neutral-800 p-8 text-white">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center">
            <Link href="/f/1" className="mr-2 text-indigo-200/80 hover:text-indigo-100 transition-colors">
              My Drive
            </Link>
            {props.parents.map((folder, index) => (
              <div key={folder.id} className="flex items-center">
                <ChevronRight className="mx-2 text-indigo-300/50" size={16} />
                <Link
                  href={`/f/${folder.id}`}
                  className="text-indigo-200/80 hover:text-indigo-100 transition-colors"
                >
                  {folder.name}
                </Link>
              </div>
            ))}
          </div>
          <div>
            <SignedOut>
              <SignInButton />
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
          </div>
        </div>
        
        <div className="mb-4 flex items-center gap-4">
          <Button
            onClick={() => setIsCreatingFolder(true)}
            className="flex items-center gap-2 border border-indigo-500/50 bg-indigo-900/30 text-indigo-100 backdrop-blur-md transition-colors hover:bg-indigo-800/50"
          >
            <FolderPlus size={16} />
            New Folder
          </Button>
          
          {isCreatingFolder && (
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                placeholder="Folder name"
                className="px-3 py-2 bg-neutral-800/50 border border-indigo-500/30 text-white rounded backdrop-blur-sm focus:outline-none focus:border-indigo-400/50"
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleCreateFolder();
                  if (e.key === "Escape") {
                    setIsCreatingFolder(false);
                    setNewFolderName("");
                  }
                }}
                autoFocus
              />
              <Button 
                onClick={handleCreateFolder} 
                size="sm"
                className="border border-green-500/50 bg-green-900/30 text-green-100 backdrop-blur-md transition-colors hover:bg-green-800/50"
              >
                Create
              </Button>
              <Button 
                onClick={() => {
                  setIsCreatingFolder(false);
                  setNewFolderName("");
                }} 
                variant="ghost" 
                size="sm"
                className="text-indigo-200/80 hover:text-indigo-100 hover:bg-neutral-800/50"
              >
                Cancel
              </Button>
            </div>
          )}
        </div>

        <div className="rounded-lg bg-neutral-900/50 backdrop-blur-md border border-indigo-500/20 shadow-xl">
          <div className="border-b border-indigo-500/20 px-6 py-4">
            <div className="grid grid-cols-12 gap-4 text-sm font-medium text-indigo-200/60">
              <div className="col-span-6">Name</div>
              <div className="col-span-2">Type</div>
              <div className="col-span-3">Size</div>
              <div className="col-span-1"></div>
            </div>
          </div>
          <ul>
            {props.folders.map((folder) => (
              <FolderRow key={folder.id} folder={folder} />
            ))}
            {props.files.map((file) => (
              <FileRow key={file.id} file={file} />
            ))}
          </ul>
        </div>
        <div className="mt-6">
          <UploadButton
            endpoint="driveUploader"
            onBeforeUploadBegin={(files) => {
              posthog.capture("files_uploading", {
                fileCount: files.length,
              });

              return files;
            }}
            onClientUploadComplete={() => {
              navigate.refresh();
            }}
            input={{
              folderId: props.currentFolderId,
            }}
          />
        </div>
      </div>
    </div>
  );
}
