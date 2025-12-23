import { drizzle } from "drizzle-orm/better-sqlite3";
import * as userSchema from "./schemas/users";
import * as taskSchema from "./schemas/tasks";
import { relations } from "./schemas";
import { env } from "$env/dynamic/private";

if (!env.DATABASE_URL) throw new Error("DATABASE_URL is not set");

export const db = drizzle(env.DATABASE_URL, {
	schema: {
		...userSchema,
		...taskSchema,
	},
	relations,
});
