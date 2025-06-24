import { Folder as FolderIcon, FileIcon, Trash2Icon } from "lucide-react";
import Link from "next/link";
import { Button } from "~/components/ui/button";
import { deleteFile, deleteFolderAction } from "~/server/actions";
import type { folders_table, files_table } from "~/server/db/schema";

export function FileRow(props: { file: typeof files_table.$inferSelect }) {
  const { file } = props;
  return (
    <li
      key={file.id}
      className="hover:bg-indigo-900/10 border-b border-indigo-500/10 px-6 py-4 transition-colors"
    >
      <div className="grid grid-cols-12 items-center gap-4">
        <div className="col-span-6 flex items-center">
          <a
            href={file.url}
            className="flex items-center text-indigo-100 hover:text-indigo-200 transition-colors"
            target="_blank"
          >
            <FileIcon className="mr-3 text-indigo-300/60" size={20} />
            {file.name}
          </a>
        </div>
        <div className="col-span-2 text-indigo-200/60">{"file"}</div>
        <div className="col-span-3 text-indigo-200/60">{file.size}</div>
        <div className="col-span-1 text-indigo-200/60">
          <Button
            variant="ghost"
            onClick={() => deleteFile(file.id)}
            aria-label="Delete file"
            className="text-red-300/60 hover:text-red-200 hover:bg-red-900/20"
          >
            <Trash2Icon size={20} />
          </Button>
        </div>
      </div>
    </li>
  );
}

export function FolderRow(props: {
  folder: typeof folders_table.$inferSelect;
}) {
  const { folder } = props;
  return (
    <li
      key={folder.id}
      className="hover:bg-indigo-900/10 border-b border-indigo-500/10 px-6 py-4 transition-colors"
    >
      <div className="grid grid-cols-12 items-center gap-4">
        <div className="col-span-6 flex items-center">
          <Link
            href={`/f/${folder.id}`}
            className="flex items-center text-indigo-100 hover:text-indigo-200 transition-colors"
          >
            <FolderIcon className="mr-3 text-indigo-300/60" size={20} />
            {folder.name}
          </Link>
        </div>
        <div className="col-span-2 text-indigo-200/60">folder</div>
        <div className="col-span-3 text-indigo-200/60"></div>
        <div className="col-span-1 text-indigo-200/60">
          <Button
            variant="ghost"
            onClick={() => deleteFolderAction(folder.id)}
            aria-label="Delete folder"
            className="text-red-300/60 hover:text-red-200 hover:bg-red-900/20"
          >
            <Trash2Icon size={20} />
          </Button>
        </div>
      </div>
    </li>
  );
}
