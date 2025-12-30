import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const user = sqliteTable("user", {
	id: text("id").primaryKey(),
	username: text("username").notNull().unique(),
	passwordHash: text("password_hash").notNull(),
	avatar: text("avatar"),
	email: text("email"),
});

export const session = sqliteTable("session", {
	id: text("id").primaryKey(),
	userId: text("user_id")
		.notNull()
		.references(() => user.id),
	expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
});
