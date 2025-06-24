import { db } from "~/server/db";
import { files_table, folders_table } from "~/server/db/schema";

async function seed() {
  console.log("Seeding database...");

  // Create root folders
  await db.insert(folders_table).values([
    {
      id: 1,
      name: "Documents",
      parent: null,
    },
    {
      id: 2,
      name: "Photos",
      parent: null,
    },
    {
      id: 3,
      name: "Projects",
      parent: null,
    },
  ]);

  console.log("Created root folders");

  // Create some subfolders
  await db.insert(folders_table).values([
    {
      id: 4,
      name: "Work",
      parent: 1, // Under Documents
    },
    {
      id: 5,
      name: "Personal",
      parent: 1, // Under Documents
    },
    {
      id: 6,
      name: "Vacation 2024",
      parent: 2, // Under Photos
    },
  ]);

  console.log("Created subfolders");

  // Create some files
  await db.insert(files_table).values([
    {
      name: "resume.pdf",
      size: 1024000,
      url: "/files/resume.pdf",
      parent: 4, // Under Work folder
    },
    {
      name: "photo1.jpg",
      size: 2048000,
      url: "/files/photo1.jpg",
      parent: 6, // Under Vacation 2024 folder
    },
    {
      name: "notes.txt",
      size: 5120,
      url: "/files/notes.txt",
      parent: 1, // Under Documents
    },
  ]);

  console.log("Created files");
  console.log("Seeding complete!");
}

seed().catch(console.error);
