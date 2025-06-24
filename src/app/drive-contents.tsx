"use client"

import { Upload, ChevronRight } from "lucide-react"
import { Button } from "~/components/ui/button"
import { FileRow, FolderRow } from "./file-row"
import { files_table, folders_table } from "~/server/db/schema"
import Link from "next/link"

interface GoogleDriveCloneProps {
  files: (typeof files_table.$inferSelect)[]
  folders: (typeof folders_table.$inferSelect)[]
  allFolders?: (typeof folders_table.$inferSelect)[]
  currentFolderId?: number | null
}

export default function GoogleDriveClone({ files, folders, allFolders, currentFolderId = null }: GoogleDriveCloneProps) {
  const currentFolder = currentFolderId
  
  // Use allFolders for breadcrumbs if available, otherwise use folders
  const foldersForBreadcrumb = allFolders || folders

  const getBreadcrumbs = () => {
    const breadcrumbs = []
    let currentId = currentFolder

    while (currentId !== null) {
      const folder = foldersForBreadcrumb.find((folder) => folder.id === currentId)
      if (folder) {
        breadcrumbs.unshift(folder)
        currentId = folder.parent
      } else {
        break
      }
    }

    return breadcrumbs
  }

  const handleUpload = () => {
    alert("Upload functionality would be implemented here")
  }

  // Files and folders are already filtered at database level
  const currentFiles = files
  const currentFolders = folders

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <Link
              href="/"
              className="text-gray-300 hover:text-white mr-2 px-3 py-2 rounded hover:bg-gray-700 transition-colors"
            >
              My Drive
            </Link>
            {getBreadcrumbs().map((folder, index) => (
              <div key={folder.id} className="flex items-center">
                <ChevronRight className="mx-2 text-gray-500" size={16} />
                <Link
                  href={`/f/${folder.id}`}
                  className="text-gray-300 hover:text-white px-3 py-2 rounded hover:bg-gray-700 transition-colors"
                >
                  {folder.name}
                </Link>
              </div>
            ))}
          </div>
          <Button onClick={handleUpload} className="bg-blue-600 text-white hover:bg-blue-700">
            <Upload className="mr-2" size={20} />
            Upload
          </Button>
        </div>
        <div className="bg-gray-800 rounded-lg shadow-xl">
          <div className="px-6 py-4 border-b border-gray-700">
            <div className="grid grid-cols-12 gap-4 text-sm font-medium text-gray-400">
              <div className="col-span-6">Name</div>
              <div className="col-span-3">Type</div>
              <div className="col-span-3">Size</div>
            </div>
          </div>
          <ul>
            {currentFolders.map((folder) => (
              <FolderRow key={`folder-${folder.id}`} folder={folder} />
            ))}
            {currentFiles.map((file) => (
              <FileRow key={`file-${file.id}`} file={file} />
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

