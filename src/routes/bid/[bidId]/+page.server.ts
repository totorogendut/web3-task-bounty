import { db } from "$lib/server/db/index.js";
import type { Actions } from "@sveltejs/kit";
import { error } from "@sveltejs/kit";

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
