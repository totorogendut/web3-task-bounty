import { integer, text } from "drizzle-orm/sqlite-core";
import { nanoid } from "nanoid";

export const BASE_TABLE_DATE = {
	createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
	updatedAt: integer("updated_at", { mode: "timestamp" })
		.$defaultFn(() => new Date())
		.$onUpdateFn(() => new Date()),
};

export const BASE_TABLE = {
	id: text("id")
		.primaryKey()
		.$defaultFn(() => nanoid()),
	...BASE_TABLE_DATE,
};
