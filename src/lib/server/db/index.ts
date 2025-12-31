import { drizzle } from "drizzle-orm/better-sqlite3";
import * as userSchema from "./schemas/users";
import * as taskSchema from "./schemas/tasks";
import * as paymentSchema from "./schemas/payments";
import { relations, keyvalSchema } from "./schemas";
import { env } from "$env/dynamic/private";
import { eq } from "drizzle-orm";
import { error } from "node:console";

if (!env.DATABASE_URL) throw new Error("DATABASE_URL is not set");

export const db = drizzle(env.DATABASE_URL, {
	schema: {
		...userSchema,
		...taskSchema,
		...paymentSchema,
		keyval: keyvalSchema,
	},
	relations,
});

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
