import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { nanoid } from "nanoid";
import { user } from "./users";
import { BASE_TABLE } from "./_shared";
import type { COMMENTABLE_TYPE, TASK_STATE } from "$lib/api/_shared";
import type { Hex } from "viem";

export const bounty = sqliteTable("bounty", {
	...BASE_TABLE,
	title: text("title"),
	description: text("description"),
	content: text("content"),
	clientId: text("client_id")
		.notNull()
		.references(() => user.id),
	escrowContractAddress: text("escrow_contract_address").$type<Hex>(),
	factoryContractAddress: text("factory_contract_address").$type<Hex>(),
	rewardAmount: text("reward_amount").notNull().default("0.00").$type<`${number}.${number}`>(),
	isClaimed: integer("is_claimed", { mode: "boolean" }).default(false),
});

export const task = sqliteTable("task", {
	...BASE_TABLE,
	userId: text("user_id")
		.notNull()
		.references(() => user.id),
	bountyId: text("bounty_id")
		.notNull()
		.references(() => bounty.id),
	content: text("content").notNull(),
	title: text("title").notNull(),
	submission: text("submission"),
	state: text("state").$type<(typeof TASK_STATE)[number]>().default("in_progress"),
});

export const comment = sqliteTable("comment", {
	...BASE_TABLE,
	content: text("content"),
	commentableType: text("commentable_type")
		.$type<(typeof COMMENTABLE_TYPE)[number]>()
		.default("task"),
	commentableId: text("commentable_id"),
	userId: text("userId")
		.notNull()
		.references(() => user.id),
});
export const progress = sqliteTable("progress", {
	...BASE_TABLE,
	content: text("content"),
	commentableId: text("commentable_id"),
	userId: text("userId")
		.notNull()
		.references(() => user.id),
	taskId: text("task_id")
		.notNull()
		.references(() => task.id),
	attachments: text("attachments").$type<string[]>(),
});
