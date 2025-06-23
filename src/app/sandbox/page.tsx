import { mockFiles, MockFolders } from "~/lib/mock-data";
import { db } from "~/server/db";
import { files_table, folders_table } from "~/server/db/schema";


export default function sandbox() {
  return <div>

    <h1>Sandbox</h1>
    <p>This is a sandbox page for testing and development purposes.</p>
    <form action= {async ()=>{
        "use server";
        
        console.log("Form submitted");

        // Clear existing data first (optional - remove if you want to keep existing data)
        // await db.delete(files_table);
        // await db.delete(folders_table);

        // Insert root folders first (those with no parent or parent "root")
        const rootFolders = MockFolders.filter(folder => !folder.parent || folder.parent === "root");
        await db.insert(folders_table).values(rootFolders.map(folder => ({
          ownerId: "user123",
          name: folder.name,
          parent: null,
        })));

        // Insert child folders
        const childFolders = MockFolders.filter(folder => folder.parent && folder.parent !== "root");
        if (childFolders.length > 0) {
          await db.insert(folders_table).values(childFolders.map(folder => ({
            ownerId: "user123",
            name: folder.name,
            parent: parseInt(folder.parent!) || null,
          })));
        }

        // Insert files
        const filesToInsert = mockFiles.filter(file => file.type === "file");
        if (filesToInsert.length > 0) {
          await db.insert(files_table).values(filesToInsert.map(file => ({
            ownerId: "user123",
            name: file.name,
            size: parseInt(file.size?.replace(/[^\d]/g, '') || "0"),
            url: file.url || "",
            parent: file.parent && !isNaN(parseInt(file.parent)) ? parseInt(file.parent) : null,
          })));
        }

    } }>
        <button type="submit">Submit</button>
    </form>
  </div>;
}