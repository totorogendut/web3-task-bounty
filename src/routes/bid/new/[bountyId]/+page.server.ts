import { db } from "$lib/server/db";
import type { Bounty } from "$lib/server/db/schemas";
import { bounty, bid } from "$lib/server/db/schemas/tasks";
import { bidInsertSchema } from "$lib/server/db/schemas/_types";
import { error, fail, redirect } from "@sveltejs/kit";
import type { Actions } from "@sveltejs/kit";
import { ZodError } from "zod/v4";

export const actions: Actions = {
	default: async (event) => {
		if (!event.locals.user?.id) throw error(401, "Musts logged in to claim bounty");
		if (!event.params.bountyId) throw error(404, "Failed to find bounty to bid to");
		const formData = await event.request.formData();
		const data: typeof bid.$inferInsert = {
			content: formData.get("content") as string,
			bountyId: event.params.bountyId,
			userId: event.locals.user.id,
		};

		try {
			bidInsertSchema.parse(data);
			const [result] = await db.insert(bid).values(data).returning();
			return result;
		} catch (err) {
			if (err instanceof ZodError) return { error: err.cause };
			return { error: (err as any)?.message || err };
		}
	},
};
