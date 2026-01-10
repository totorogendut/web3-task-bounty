import { getRequestEvent, query } from "$app/server";
import { db } from "$lib/server/db";
import { bid, bounty } from "$lib/server/db/schemas/tasks";
import z from "zod/v4";
import { BID_STATE } from "./_shared";
import { and, eq } from "drizzle-orm";
import type { Bid } from "$lib/server/db/schemas";
import { error } from "@sveltejs/kit";
import { bidSchemas } from "$lib/schemas";
import { decodeEventLog, type Hex } from "viem";
import { publicClient } from "$lib/contracts.svelte";
import { ESCROW_ABI } from "$lib/_eth-abi";

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
		bidSchemas.pick({ content: true }).parse(data);

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

export const setWinningBid = query(
	z.object({
		id: z.string(),
		hash: z.custom<Hex>(),
	}),
	async ({ id, hash }) => {
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

		await waitForPayout(hash);

		const bidQ = db.update(bid).set({ state: "approved" }).where(eq(bid.id, id)).returning();
		const bountyQ = db
			.update(bounty)
			.set({ winnerId: item.userId, winningBidId: item.id, escrowStatus: "finished" })
			.where(eq(bounty.id, item.bountyId));

		const [[winningBid]] = await Promise.all([bidQ, bountyQ]);

		if (!winningBid) error(404, "Update failed. Item not found.");

		return { success: true };
	},
);

async function waitForPayout(hash: Hex) {
	const receipt = await publicClient.waitForTransactionReceipt({
		hash,
	});
	const paymentEvents = receipt.logs
		.map((log) => {
			try {
				return decodeEventLog({
					abi: ESCROW_ABI,
					data: log.data,
					topics: log.topics,
				});
			} catch {
				return null;
			}
		})
		.filter(
			(e): e is { eventName: "PaymentReleased"; args: any } => e?.eventName === "PaymentReleased",
		);

	if (!paymentEvents?.[0]?.args) throw new Error("Failed to parse transaction logs");

	return paymentEvents[0].args as {
		payout: bigint;
		freelancer: Hex;
	};
}
