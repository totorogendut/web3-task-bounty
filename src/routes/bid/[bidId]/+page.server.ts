import { db } from "$lib/server/db/index.js";
import { bountyInsertSchema } from "$lib/server/db/schemas/_types";
import { bounty } from "$lib/server/db/schemas/tasks";
import type { Actions } from "@sveltejs/kit";
import { error } from "@sveltejs/kit";
import { ZodError } from "zod/v4";

export const load = async ({ params, url }) => {
	const bid = await db.query.bid.findFirst({
		where: {
			id: params.bidId,
		},
		with: {
			bounty: true,
		},
	});

	if (!bid) throw error(404, "Bid not found.");

	return {
		...bid,
	};
};

export const actions: Actions = {
	default: async (event) => {},
};
