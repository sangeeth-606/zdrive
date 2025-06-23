import { singlestoreTable, singlestoreSchema, AnySingleStoreColumn, primaryKey, bigint, text } from "drizzle-orm/singlestore-core"
import { sql } from "drizzle-orm"

export const zdriveTutorialFilesTable = singlestoreTable("zdrive_tutorial_files_table", {
	id: bigint({ mode: "number" }).autoincrement().notNull(),
	name: text(),
	url: text(),
	parent: bigint({ mode: "number" }),
	size: text(),
},
(table) => [
	primaryKey({ columns: [table.id], name: "zdrive_tutorial_files_table_id"}),
]);
