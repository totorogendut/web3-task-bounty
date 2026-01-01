import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { nanoid } from "nanoid";

export const user = sqliteTable("user", {
	id: text("id")
		.primaryKey()
		.$default(() => nanoid()),
	username: text("username").unique(),
	// passwordHash: text("password_hash").notNull(),
	walletAddress: text("wallet_address").$type<`0x${string}`>(),
	avatar: text("avatar"),
	email: text("email"),
	nonce: text("nonce"),
	lastLoginAt: integer("last_login_at", { mode: "timestamp" }).$default(() => new Date()),
});

export const session = sqliteTable("session", {
	id: text("id").primaryKey(),
	userId: text("user_id")
		.notNull()
		.references(() => user.id),
	expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
});
