import { db } from "$lib/server/db";
import { bounty } from "$lib/server/db/schemas/tasks";
import { error, redirect } from "@sveltejs/kit";
import type { Actions } from "@sveltejs/kit";
import { z, ZodError } from "zod/v4";
import { daysAfter } from "$lib/utils/date";
import type { Hex } from "viem";
import { publicClient } from "$lib/server/viem/contracts";
import { eq } from "drizzle-orm";
import { bountySchemas, bountySchemasServer } from "$lib/schemas";
import type { tokens } from "$lib/_eth-shared";

export const actions: Actions = {
	default: async (event) => {
		if (!event.locals.user?.id) throw error(401, "Musts logged in to post bounty");
		const formData = await event.request.formData();
		const data: typeof bounty.$inferInsert = {
			description: formData.get("description") as string,
			content: formData.get("content") as string,
			title: formData.get("title") as string,
			rewardAmount: formData.get("rewardAmount") as `${number}.${number}`,
			clientId: event.locals.user.id,
			rewardCurrency: formData.get("rewardCurrency") as keyof typeof tokens.mainnet,
			deadline: daysAfter(parseInt(formData.get("deadline") as string)),
		};

		try {
			bountySchemasServer.parse(data);
			const [result] = await db.insert(bounty).values(data).returning();
			if (!result) throw error(500, "Error inserting bounty data");

			return {
				...result,
			};
		} catch (err) {
			console.log(err);
			if (err instanceof ZodError) throw error(400, err.message);
			throw error(500, (err as any)?.body || err);
		}
	},
};

async function applyEscrowContract(bountyId: string, txHash: Hex) {
	const t = await publicClient.waitForTransactionReceipt({ hash: txHash });
	const log = t.logs.find((log) => log.transactionHash === txHash);
	if (!log) throw error(500, "Smart contract transaction failed");
	await db.update(bounty).set({ escrowAddress: log.address }).where(eq(bounty.id, bountyId));
}
