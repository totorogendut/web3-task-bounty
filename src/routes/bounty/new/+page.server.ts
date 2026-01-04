import { db } from "$lib/server/db";
import { bounty, bid } from "$lib/server/db/schemas/tasks";
import { bountyInsertSchema } from "$lib/server/db/schemas/_types";
import { error, redirect } from "@sveltejs/kit";
import type { Actions } from "@sveltejs/kit";
import { z, ZodError } from "zod/v4";

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
			deadline: new Date(formData.get("deadline") as string),
		};

		try {
			bountyInsertSchema.parse(data);
			const [result] = await db.insert(bounty).values(data).returning();

			return redirect(302, `/bounty/${result.id}/`);
		} catch (err) {
			if (err instanceof ZodError) throw error(500, err.message);
			throw error(500, "Failed to insert bounty");
		}
	},
};
