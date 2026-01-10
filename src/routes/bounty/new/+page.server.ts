import { db } from "$lib/server/db";
import { bounty } from "$lib/server/db/schemas/tasks";
import { error, redirect } from "@sveltejs/kit";
import type { Actions } from "@sveltejs/kit";
import { daysAfter } from "$lib/utils/date";
import { bountySchemasServer } from "$lib/schemas";
import type { tokens } from "$lib/_eth-shared";

export const actions: Actions = {
	default: async (event) => {
		if (!event.locals.user?.id) throw error(401, "Musts logged in to post bounty");
		const formData = await event.request.formData();
		const data: typeof bounty.$inferInsert = {
			description: formData.get("description") as string,
			content: formData.get("content") as string,
			title: formData.get("title") as string,
			skills: JSON.parse(formData.get("skills") as string) as string[],
			rewardAmount: formData.get("rewardAmount") as `${number}.${number}`,
			clientId: event.locals.user.id,
			rewardCurrency: formData.get("rewardCurrency") as keyof typeof tokens.mainnet,
			deadline: daysAfter(parseInt(formData.get("deadline") as string)),
		};

		bountySchemasServer.parse(data);
		const [result] = await db.insert(bounty).values(data).returning();
		if (!result) throw error(500, "Error inserting bounty data");

		throw redirect(303, `/approve/${result.id}/`);
	},
};
