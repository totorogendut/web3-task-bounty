import { drizzle } from "drizzle-orm/better-sqlite3";
import * as userSchema from "./schemas/users";
import * as taskSchema from "./schemas/tasks";
import * as paymentSchema from "./schemas/payments";
import { relations, keyval } from "./schemas";
import { env } from "$env/dynamic/private";

if (!env.DATABASE_URL) throw new Error("DATABASE_URL is not set");

export const db = drizzle(env.DATABASE_URL, {
	schema: {
		keyval,
		...userSchema,
		...taskSchema,
		...paymentSchema,
	},
	relations,
});
