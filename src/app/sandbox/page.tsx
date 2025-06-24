import { mockFiles, MockFolders } from "~/lib/mock-data";
import { db } from "~/server/db";
import { files_table, folders_table } from "~/server/db/schema";
import { eq } from "drizzle-orm";


export default function sandbox() {
  return <div>

    <h1>Sandbox</h1>
    <p>This is a sandbox page for testing and development purposes.</p>
    <form action= {async ()=>{
        "use server";
        
        console.log("Form submitted");

        // Clear existing data first
        await db.delete(files_table);
        await db.delete(folders_table);
        
        console.log("Cleared all existing data");

        // Clear existing data first
        await db.delete(files_table);
        await db.delete(folders_table);
        
        console.log("Cleared all existing data");

        // Insert root folders first (they will get IDs 1, 2, 3)
        const rootFolders = MockFolders.filter(folder => !folder.parent);
        const insertedRootFolders = [];
        
        for (const folder of rootFolders) {
          const result = await db.insert(folders_table).values({
            ownerId: "user123",
            name: folder.name,
            parent: null,
          });
          insertedRootFolders.push({ originalId: folder.id, name: folder.name });
        }
        
        console.log("Inserted root folders:", insertedRootFolders);

        // Get the actual inserted folders to map old IDs to new IDs
        const actualFolders = await db.select().from(folders_table);
        console.log("Actual folders after root insert:", actualFolders);
        
        // Create a mapping from old mock IDs to new database IDs
        const idMapping: Record<string, number> = {};
        rootFolders.forEach((mockFolder, index) => {
          const actualFolder = actualFolders.find(f => f.name === mockFolder.name && f.parent === null);
          if (actualFolder) {
            idMapping[mockFolder.id] = actualFolder.id;
          }
        });
        
        console.log("ID Mapping after root folders:", idMapping);

        // Insert subfolders using the mapped parent IDs
        const subFolders = MockFolders.filter(folder => folder.parent);
        for (const folder of subFolders) {
          const parentId = idMapping[folder.parent!];
          if (parentId) {
            const result = await db.insert(folders_table).values({
              ownerId: "user123",
              name: folder.name,
              parent: parentId,
            });
            
            // Update mapping for this subfolder
            const newFolder = await db.select().from(folders_table).where(eq(folders_table.name, folder.name)).limit(1);
            if (newFolder[0]) {
              idMapping[folder.id] = newFolder[0].id;
            }
          }
        }
        
        console.log("Final ID Mapping:", idMapping);

        // Insert files using the mapped parent IDs
        const filesToInsert = mockFiles.filter(file => file.type === "file");
        for (const file of filesToInsert) {
          const parentId = idMapping[file.parent!];
          if (parentId) {
            await db.insert(files_table).values({
              ownerId: "user123",
              name: file.name,
              size: Math.round(parseFloat(file.size?.replace(/[^\d.]/g, '') || "0") * 1024 * 1024), // Convert MB to bytes
              url: file.url || "",
              parent: parentId,
            });
          }
        }
        
        console.log("Inserted all files");

        // Final verification
        const finalFolders = await db.select().from(folders_table);
        const finalFiles = await db.select().from(files_table);
        console.log("=== FINAL RESULT ===");
        console.log("Folders:", finalFolders);
        console.log("Files:", finalFiles);

    } }>
        <button type="submit">Submit</button>
    </form>
  </div>;
}