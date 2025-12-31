import { error } from "@sveltejs/kit";
import { db } from "./db";
import type { Task, User } from "./db/schemas";
import { transferFund } from "./viem";
import { transaction } from "./db/schemas/payments";

export async function payApprovedTask(taskId: string) {
	const data = await db.query.task.findFirst({
		where: {
			id: taskId,
		},
		with: {
			bounty: true,
			user: true,
		},
	});

	if (!data || !data.bounty || !data.user) throw error(500, "Error querying task data.");
	if (!data.user.walletAddress) throw error(500, "No wallet address to transfer to.");
	const txHash = await transferFund(data.user.walletAddress, data.bounty.rewardAmount);

	await db.insert(transaction).values({
		bountyId: data.bountyId,
		userId: data.userId,
		txHash,
		amount: data.bounty.rewardAmount,
		taskId,
		address: data.user.walletAddress,
	});
}
