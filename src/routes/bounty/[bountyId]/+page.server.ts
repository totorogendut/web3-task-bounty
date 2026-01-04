import { db } from "$lib/server/db/index.js";
import { USER_CLIENT_QUERY_DATA } from "$lib/user.svelte";
import { error } from "@sveltejs/kit";

/** @type {import('./$types').PageLoad} */
export async function load({ params }) {
	// Add additional logic here, if needed
	const bounty = await db.query.bounty.findFirst({
		where: {
			id: params.bountyId,
		},
		with: {
			bids: {
				limit: 20,
			},
			client: USER_CLIENT_QUERY_DATA,
		},
	});

	if (!bounty) throw error(404, "No bounty post found");

	return {
		bounty,
		// contentHTML: await parseMarkdown(bounty.content || ""),
	};
}
