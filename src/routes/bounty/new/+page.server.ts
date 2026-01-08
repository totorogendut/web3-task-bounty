import { db } from "$lib/server/db";
import { bounty, bid } from "$lib/server/db/schemas/tasks";
import { bountyInsertSchema } from "$lib/server/db/schemas/_types";
import { error, redirect } from "@sveltejs/kit";
import type { Actions } from "@sveltejs/kit";
import { z, ZodError } from "zod/v4";
import type { Bounty } from "$lib/server/db/schemas";
import { daysAfter } from "$lib/utils/date";
import type { Hex } from "viem";
import { publicClient } from "$lib/server/viem/contracts";
import { eq } from "drizzle-orm";

export const actions: Actions = {
	default: async (event) => {
		if (!event.locals.user?.id) throw error(401, "Musts logged in to post bounty");
		const formData = await event.request.formData();
		const data: typeof bounty.$inferInsert = {
			id: formData.get("id") as string,
			description: formData.get("description") as string,
			content: formData.get("content") as string,
			title: formData.get("title") as string,
			rewardAmount: formData.get("rewardAmount") as `${number}.${number}`,
			clientId: event.locals.user.id,
			rewardCurrency: formData.get("rewardCurrency") as string,
			deadline: daysAfter(parseInt(formData.get("deadline") as string)),
		};

		try {
			bountyInsertSchema.parse(data);
			const [result] = await db.insert(bounty).values(data).returning();
			if (!result) throw error(500, "Error inserting bounty data");
			applyEscrowContract(result.id, formData.get("txHash") as Hex);

			return redirect(302, `/bounty/${result.id}/`);
		} catch (err) {
			if (err instanceof ZodError) return { error: err.cause };
			return { error: (err as any)?.message || err };
		}
	},
};

async function applyEscrowContract(bountyId: string, txHash: Hex) {
	const t = await publicClient.waitForTransactionReceipt({ hash: txHash });
	const log = t.logs.find((log) => log.transactionHash === txHash);
	if (!log) throw error(500, "Smart contract transaction failed");
	await db.update(bounty).set({ escrowAddress: log.address }).where(eq(bounty.id, bountyId));
}
