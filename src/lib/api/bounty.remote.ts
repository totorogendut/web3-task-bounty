import { getRequestEvent, query } from "$app/server";
import { db } from "$lib/server/db";
import { bid } from "$lib/server/db/schemas/tasks";
import z from "zod/v4";
import { COMMENTABLE_TYPE, BID_STATE } from "./_shared";
import { and, eq } from "drizzle-orm";
import type { Bid } from "$lib/server/db/schemas";
import { error } from "@sveltejs/kit";
import { payApprovedBid } from "$lib/server/payment";
import { bidInsertSchema } from "$lib/server/db/schemas/_types";

export const editBid = query(
	z.object({
		id: z.string(),
		content: z.string().optional(),
	}),
	async ({ id, content }) => {
		const data: Partial<Bid> = {};
		const { locals } = getRequestEvent();
		if (!locals.user?.id) throw error(403, "You must login to continue.");

		if (content) data.content = content;
		bidInsertSchema.pick({ content: true }).parse(data);

		const { changes } = await db
			.update(bid)
			.set(data as Bid)
			.where(and(eq(bid.id, id), eq(bid.userId, locals.user.id)));

		if (!changes) throw error(404, "Edit failed. Item not found.");

		return { success: true };
	},
);
export const submitBid = query(
	z.object({
		id: z.string(),
	}),
	async ({ id }) => {
		const { locals } = getRequestEvent();
		if (!locals.user?.id) throw error(403, "You must login to continue.");

		const { changes } = await db
			.update(bid)
			.set({ state: "submitted" })
			.where(and(eq(bid.id, id), eq(bid.userId, locals.user.id)));

		if (!changes) error(404, "Submit failed. Item not found.");

		return { success: true };
	},
);

export const changeBidState = query(
	z.object({
		id: z.string(),
		state: z.enum(BID_STATE),
	}),
	async ({ id, state }) => {
		// check if manager has permision
		const { locals } = getRequestEvent();
		if (!locals.user?.id) throw error(403, "You must login to continue.");

		const { changes } = await db.update(bid).set({ state }).where(eq(bid.id, id));
		if (!changes) error(404, "Update failed. Item not found.");
		return { success: true };
	},
);

export const downloadBidAttachment = query(
	z.object({
		id: z.string(),
	}),
	async ({ id }) => {
		// check if manager has permision
		const { locals } = getRequestEvent();
		if (!locals.user?.id) throw error(403, "You must login to continue.");
		const item = await db.query.bid.findFirst({
			where: { id },
			with: { bounty: { columns: { clientId: true } } },
		});
		if (!item) error(404, "Update failed. Item not found.");
		if (item.bounty?.clientId && item.bounty.clientId !== locals.user.id)
			throw error(403, "You are not authorized to approve this bid.");

		// DOWNLOAD attachment
		return { success: true };
	},
);

export const approveBid = query(
	z.object({
		id: z.string(),
	}),
	async ({ id }) => {
		// check if manager has permision
		const { locals } = getRequestEvent();
		if (!locals.user?.id) throw error(403, "You must login to continue.");

		const item = await db.query.bid.findFirst({
			where: { id },
			with: { bounty: { columns: { clientId: true } } },
		});

		if (!item) error(404, "Update failed. Item not found.");
		if (item.bounty?.clientId && item.bounty.clientId !== locals.user.id)
			throw error(403, "You are not authorized to approve this bid.");

		const [result] = await db
			.update(bid)
			.set({ state: "approved" })
			.where(eq(bid.id, id))
			.returning();
		if (!result) error(404, "Update failed. Item not found.");

		await payApprovedBid(result.id);

		return { success: true };
	},
);
