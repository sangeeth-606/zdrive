export interface File {
  id: string
  name: string
  type: "file" | "folder"
  url?: string
  parent: string | null
  size?: string
}

export type Folder= {
  id : string
  name: string
  type: "folder"
  parent: string | null
}

export const MockFolders: Folder[] = [
  // Root folders (parent: null) - will have IDs 1, 2, 3
  { id: "1", name: "Documents", type: "folder", parent: null },
  { id: "2", name: "Images", type: "folder", parent: null },
  { id: "3", name: "Work", type: "folder", parent: null },
  
  // Subfolders - will have IDs 4, 5, 6
  { id: "4", name: "Personal", type: "folder", parent: "1" }, // Under Documents
  { id: "5", name: "Projects", type: "folder", parent: "3" }, // Under Work
  { id: "6", name: "Presentations", type: "folder", parent: "3" }, // Under Work
]

export const mockFiles: File[] = [
  // Files in Documents folder (ID: 1)
  { id: "7", name: "Resume.pdf", type: "file", url: "/files/resume.pdf", parent: "1", size: "1.2 MB" },
  { id: "8", name: "Project Proposal.docx", type: "file", url: "/files/proposal.docx", parent: "1", size: "2.5 MB" },
  
  // Files in Images folder (ID: 2) 
  { id: "9", name: "Vacation.jpg", type: "file", url: "/files/vacation.jpg", parent: "2", size: "3.7 MB" },
  { id: "10", name: "Profile Picture.png", type: "file", url: "/files/profile.png", parent: "2", size: "1.8 MB" },
  { id: "11", name: "Beach Photo.jpg", type: "file", url: "/files/beach.jpg", parent: "2", size: "2.4 MB" },
  
  // Files in Work folder (ID: 3)
  { id: "12", name: "Budget.xlsx", type: "file", url: "/files/budget.xlsx", parent: "3", size: "1.5 MB" },
  
  // Files in Personal folder (ID: 4)
  { id: "13", name: "Meeting Notes.txt", type: "file", url: "/files/notes.txt", parent: "4", size: "0.5 MB" },
  { id: "14", name: "Todo List.txt", type: "file", url: "/files/todo.txt", parent: "4", size: "0.2 MB" },
  
  // Files in Projects folder (ID: 5)
  { id: "15", name: "App Design.sketch", type: "file", url: "/files/design.sketch", parent: "5", size: "8.1 MB" },
  
  // Files in Presentations folder (ID: 6)
  { id: "16", name: "Q4 Report.pptx", type: "file", url: "/files/q4-report.pptx", parent: "6", size: "5.2 MB" },
]

