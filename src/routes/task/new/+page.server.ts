import { db } from "$lib/server/db";
import type { Bounty } from "$lib/server/db/schemas";
import { bounty, task } from "$lib/server/db/schemas/tasks";
import { taskInsertSchema } from "$lib/server/db/schemas/types";
import { error } from "@sveltejs/kit";
import type { Actions } from "@sveltejs/kit";
import { ZodError } from "zod/v4";

export const actions: Actions = {
	default: async (event) => {
		if (!event.locals.user?.id) throw error(401, "Musts logged in to post bounty");
		const formData = await event.request.formData();
		const data: typeof task.$inferInsert = {
			content: formData.get("content") as string,
			title: formData.get("title") as string,
			bountyId: formData.get("bountyId") as string,
			userId: event.locals.user.id,
		};

		try {
			taskInsertSchema.parse(data);
			await db.insert(task).values(data);
		} catch (err) {
			if (err instanceof ZodError) throw error(500, err.message);
			throw error(500, "Failed to insert bounty");
		}
	},
};
