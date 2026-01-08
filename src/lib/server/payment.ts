import { error } from "@sveltejs/kit";
import { db } from "./db";
import type { Bid, User } from "./db/schemas";
import { transaction } from "./db/schemas/payments";

export async function payApprovedBid(bidId: string) {
	const data = await db.query.bid.findFirst({
		where: {
			id: bidId,
		},
		with: {
			bounty: true,
			user: true,
		},
	});

	if (!data || !data.bounty || !data.user) throw error(500, "Error querying bid data.");
	if (!data.user.walletAddress) throw error(500, "No wallet address to transfer to.");

	await db.insert(transaction).values({
		bountyId: data.bountyId,
		userId: data.userId,
		// txHash,
		amount: data.bounty.rewardAmount,
		bidId,
		address: data.user.walletAddress,
	});
}
