import { db } from "$lib/server/db/index.js";

/** @type {import('./$types').PageLoad} */
export async function load({ params }) {
	// Add additional logic here, if needed
	const bounty = await db.query.bounty.findFirst({
		where: {
			id: params.bountyId,
		},
		with: {
			tasks: {
				limit: 20,
			},
		},
	});

	return {
		bounty,
	};
}
