import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { nanoid } from "nanoid";
import { user } from "./users";
import { BASE_TABLE } from "./_shared";

export const task = sqliteTable("tasks", {
	...BASE_TABLE,
	manager: text("manager")
		.notNull()
		.references(() => user.id),
});
