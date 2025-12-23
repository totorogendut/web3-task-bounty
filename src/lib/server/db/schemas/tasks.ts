import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { nanoid } from "nanoid";
import { user } from "./users";
import { BASE_TABLE } from "./_shared";

export const project = sqliteTable("project", {
	...BASE_TABLE,
	ownerId: text("owner_id")
		.notNull()
		.references(() => user.id),
	managersId: text("managers_id")
		.notNull()
		.references(() => user.id),
	title: text("title"),
	description: text("description"),
});

export const bounty = sqliteTable("bounty", {
	...BASE_TABLE,
	title: text("title"),
	description: text("description"),
	projectId: text("project_id")
		.notNull()
		.references(() => project.id),
	reward: integer("reward"),
	isClaimed: integer("is_claimed", { mode: "boolean" }),
});

export const task = sqliteTable("task", {
	...BASE_TABLE,
	userId: text("user_id")
		.notNull()
		.references(() => user.id),
	bountyId: text("bounty_id")
		.notNull()
		.references(() => bounty.id),
});

export const comment = sqliteTable("comment", {
	...BASE_TABLE,
	content: text("content"),
	commentableType: text("commentable_type").$type<"task" | "bounty">().default("task"),
	commentableId: text("commentable_id"),
	userId: text("userId")
		.notNull()
		.references(() => user.id),
});
