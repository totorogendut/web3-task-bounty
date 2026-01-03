import { db } from "$lib/server/db/index.js";
import { error } from "@sveltejs/kit";

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

	if (!bounty) throw error(404, "No bounty post found");

	return {
		bounty,
		// contentHTML: await parseMarkdown(bounty.content || ""),
	};
}
