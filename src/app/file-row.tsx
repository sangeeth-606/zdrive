import Link from "next/link";
import { Folder, FileIcon } from "lucide-react";

interface File {
  id: string;
  name: string;
  type: "file" | "folder";
  url?: string;
  size?: string;
}

interface FileRowProps {
  file: File;
  handleFolderClick: (id: string) => void;
}

interface FolderRowProps {
  folder: File;
  handleFolderClick: (id: string) => void;
}

export function FileRow({ file, handleFolderClick }: FileRowProps) {
  return (
    <li key={file.id} className="px-6 py-4 border-b border-gray-700 hover:bg-gray-750">
      <div className="grid grid-cols-12 gap-4 items-center">
        <div className="col-span-6 flex items-center">
          <Link href={file.url ?? "#"} target="_blank" className="flex items-center text-gray-100 hover:text-blue-400">
            <FileIcon className="mr-3" size={20} />
            {file.name}
          </Link>
        </div>
        <div className="col-span-3 text-gray-400">File</div>
        <div className="col-span-3 text-gray-400">{file.size ?? "2 MB"}</div>
      </div>
    </li>
  );
}

export function FolderRow({ folder, handleFolderClick }: FolderRowProps) {
  return (
    <li key={folder.id} className="px-6 py-4 border-b border-gray-700 hover:bg-gray-750">
      <div className="grid grid-cols-12 gap-4 items-center">
        <div className="col-span-6 flex items-center">
          <button
            onClick={() => handleFolderClick(folder.id)}
            className="flex items-center text-gray-100 hover:text-blue-400"
          >
            <Folder className="mr-3" size={20} />
            {folder.name}
          </button>
        </div>
        <div className="col-span-3 text-gray-400">Folder</div>
        <div className="col-span-3 text-gray-400">--</div>
      </div>
    </li>
  );
}
