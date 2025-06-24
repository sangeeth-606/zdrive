import Link from "next/link";
import { Folder, FileIcon } from "lucide-react";
import { files_table, folders_table } from "~/server/db/schema";

type DBFile = typeof files_table.$inferSelect;
type DBFolder = typeof folders_table.$inferSelect;

interface FileRowProps {
  file: DBFile;
}

interface FolderRowProps {
  folder: DBFolder;
}

export function FileRow({ file }: FileRowProps) {
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <li key={file.id} className="px-6 py-4 border-b border-gray-700 hover:bg-gray-750 transition-colors">
      <div className="grid grid-cols-12 gap-4 items-center">
        <div className="col-span-6 flex items-center">
          <Link href={file.url ?? "#"} className="flex items-center text-gray-100 hover:text-blue-400 transition-colors">
            <FileIcon className="mr-3 text-blue-400" size={20} />
            {file.name}
          </Link>
        </div>
        <div className="col-span-3 text-gray-400">File</div>
        <div className="col-span-3 text-gray-400">{formatFileSize(file.size)}</div>
      </div>
    </li>
  );
}

export function FolderRow({ folder }: FolderRowProps) {
  return (
    <li key={folder.id} className="px-6 py-4 border-b border-gray-700 hover:bg-gray-750 transition-colors">
      <div className="grid grid-cols-12 gap-4 items-center">
        <div className="col-span-6 flex items-center">
          <Link
            href={`/f/${folder.id}`}
            className="flex items-center text-gray-100 hover:text-blue-400 transition-colors"
          >
            <Folder className="mr-3 text-yellow-400" size={20} />
            {folder.name}
          </Link>
        </div>
        <div className="col-span-3 text-gray-400">Folder</div>
        <div className="col-span-3 text-gray-400">--</div>
      </div>
    </li>
  );
}
