import { defineRelations, eq } from "drizzle-orm";
import * as userSchema from "./users";
import * as taskSchema from "./tasks";
import * as paymentSchema from "./payments";
import { sqliteTable, text } from "drizzle-orm/sqlite-core";

export const relations = defineRelations(
	{ ...userSchema, ...taskSchema, ...paymentSchema },
	(r) => ({
		user: {
			bids: r.many.bid({
				from: r.user.id,
				to: r.bid.userId,
			}),
			bounties: r.many.bounty({
				from: r.user.id,
				to: r.bounty.clientId,
			}),
			transactions: r.many.transaction({
				from: r.user.id,
				to: r.transaction.userId,
			}),
		},
		bounty: {
			comments: r.many.comment({
				from: r.bounty.id,
				to: r.comment.commentableId,
				where: {
					commentableType: "bounty",
				},
			}),
			bids: r.many.bid({
				from: r.bounty.id,
				to: r.bid.bountyId,
			}),
			client: r.one.user({
				from: r.bounty.clientId,
				to: r.user.id,
			}),
			winningBid: r.one.bid({
				from: r.bounty.winningBidId,
				to: r.bid.id,
			}),
		},
		bid: {
			comments: r.many.comment({
				from: r.bid.id,
				to: r.comment.commentableId,
				where: {
					commentableType: "bid",
				},
			}),
			bounty: r.one.bounty({
				from: r.bid.bountyId,
				to: r.bounty.id,
			}),
			progresses: r.many.progress({
				from: r.bid.id,
				to: r.progress.bidId,
			}),
			user: r.one.user({
				from: r.bid.userId,
				to: r.user.id,
			}),
		},
		progress: {
			bid: r.one.bid({
				from: r.progress.bidId,
				to: r.bid.id,
			}),
			user: r.one.user({
				from: r.progress.userId,
				to: r.user.id,
			}),
		},
		comment: {
			user: r.one.user({
				from: r.comment.userId,
				to: r.user.id,
			}),
		},
	}),
);

export const keyvalSchema = sqliteTable("keyval", {
	key: text("key").primaryKey(),
	values: text("values", { mode: "json" }).notNull(),
});

export type User = typeof userSchema.user.$inferSelect;
export type Bounty = typeof taskSchema.bounty.$inferSelect;
export type Bid = typeof taskSchema.bid.$inferSelect;
export type CommentType = typeof taskSchema.comment.$inferSelect;
