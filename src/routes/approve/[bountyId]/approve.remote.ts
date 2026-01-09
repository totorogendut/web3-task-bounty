import { query } from "$app/server";
import { escrowStatusEnum, type EscrowStatus } from "$lib/_eth-shared";
import { db } from "$lib/server/db";
import { bounty } from "$lib/server/db/schemas/tasks";
import { error } from "@sveltejs/kit";
import { eq } from "drizzle-orm";
import { z } from "zod/v4";

export const changeEscrowStatus = query(
	z.object({
		id: z.string(),
		escrowStatus: z.custom<EscrowStatus>(),
	}),
	async ({ id, escrowStatus }) => {
		if (!escrowStatusEnum.includes(escrowStatus)) throw error(403, "Escrow status not valid");
		await db.update(bounty).set({ escrowStatus }).where(eq(bounty.id, id));
		return {
			success: true,
		};
	},
);
