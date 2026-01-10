import * as userSchema from "./schemas/users";
import * as taskSchema from "./schemas/tasks";
import * as paymentSchema from "./schemas/payments";
import { relations, keyvalSchema } from "./schemas";
import { eq } from "drizzle-orm";
import { error } from "node:console";
import { DATABASE_AUTH_TOKEN, DATABASE_URL } from "$env/static/private";
import { drizzle as libsqlDrizzle } from "drizzle-orm/libsql";
import { drizzle as nodeDrizzle } from "drizzle-orm/better-sqlite3";
import { createClient } from "@libsql/client";

if (!DATABASE_URL) throw new Error("DATABASE_URL is not set");

// =========== TURSO Setup ==================
const client = createClient({
	url: DATABASE_URL,
	authToken: DATABASE_AUTH_TOKEN,
});

export const db = libsqlDrizzle({
	client,
	schema: {
		...userSchema,
		...taskSchema,
		...paymentSchema,
		keyval: keyvalSchema,
	},
	relations,
});
// ==========================================

// =========== Nodejs better-sqlite3 ========

// export const db = nodeDrizzle(DATABASE_URL, {
// 	schema: {
// 		...userSchema,
// 		...taskSchema,
// 		...paymentSchema,
// 		keyval: keyvalSchema,
// 	},
// 	relations,
// });

// ===========================================

export const keyval = {
	get: async (key: string) => {
		const [data] = await db.select().from(keyvalSchema).where(eq(keyvalSchema.key, key)).limit(1);
		if (!data) throw error(500, "No such key found in keyval database.");
		return data;
	},
	set: async (key: string, values: any) => {
		await db.update(keyvalSchema).set({ values }).where(eq(keyvalSchema.key, key)).limit(1);
	},
};
