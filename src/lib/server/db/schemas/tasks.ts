import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { user } from "./users";
import { BASE_TABLE } from "./_shared";
import type { COMMENTABLE_TYPE, BID_STATE } from "$lib/api/_shared";
import type { Hex } from "viem";
import type { EscrowStatus, tokens } from "$lib/_eth-shared";

export const bounty = sqliteTable("bounty", {
	...BASE_TABLE,
	title: text("title"),
	description: text("description"),
	content: text("content"),
	clientId: text("client_id")
		.notNull()
		.references(() => user.id),
	winningBidId: text("winning_bid_id"),
	winnerId: text("winnerId").references(() => user.id),
	skills: text("skills", { mode: "json" }).$type<string[]>().default([]),
	escrowAddress: text("escrow_address").$type<Hex>(),
	rewardAmount: text("reward_amount").notNull().default("0.00").$type<`${number}.${number}`>(),
	rewardCurrency: text("reward_currency").default("mnee").$type<keyof typeof tokens.mainnet>(),
	deadline: integer("deadline", { mode: "timestamp" }),
	canRefund: integer("can_refund", { mode: "boolean" }).default(false),
	escrowStatus: text("escrow_status").$type<EscrowStatus>().default("approval_pending"),
});

export const bid = sqliteTable("bid", {
	...BASE_TABLE,
	userId: text("user_id")
		.notNull()
		.references(() => user.id),
	bountyId: text("bounty_id")
		.notNull()
		.references(() => bounty.id),
	content: text("content").notNull(),
	submittedAt: integer("submittedAt"),
	signature: text("signature").$type<Hex>(),
	attachments: text("attachments", { mode: "json" }).default([]).$type<string[]>(),
	state: text("state").$type<(typeof BID_STATE)[number]>().default("in_progress"),
});

export const comment = sqliteTable("comment", {
	...BASE_TABLE,
	content: text("content"),
	commentableType: text("commentable_type")
		.$type<(typeof COMMENTABLE_TYPE)[number]>()
		.default("bid"),
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
	bidId: text("bid_id")
		.notNull()
		.references(() => bid.id),
	attachments: text("attachments").$type<string[]>(),
});
