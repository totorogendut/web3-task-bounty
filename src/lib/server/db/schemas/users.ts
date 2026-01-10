import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { nanoid } from "nanoid";
import type { Hex } from "viem";

export const user = sqliteTable("user", {
	id: text("id").primaryKey().$type<Hex>(),
	username: text("username").unique(),
	avatar: text("avatar"),
	skills: text("skills", { mode: "json" }).$type<string[]>().default([]),
	email: text("email"),
	nonce: text("nonce"),
	lastLoginAt: integer("last_login_at", { mode: "timestamp" }).$default(() => new Date()),
});
