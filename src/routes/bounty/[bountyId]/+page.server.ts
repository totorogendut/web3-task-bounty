import type { EscrowStatus } from "$lib/_eth-shared.js";
import { db } from "$lib/server/db/index.js";
import { USER_CLIENT_QUERY_DATA } from "$lib/user.svelte";
import { isBountyContractPending, isEscrowApprovalPending } from "$lib/utils/escrow";
import { error, redirect } from "@sveltejs/kit";
import { marked } from "marked";
import sanitizeHtml from "sanitize-html";

/** @type {import('./$types').PageLoad} */
export async function load({ params, locals }) {
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
	const isPending =
		isEscrowApprovalPending(bounty.escrowStatus as EscrowStatus) ||
		isBountyContractPending(bounty.escrowStatus as EscrowStatus);
	if (isPending && locals.user?.id === bounty.clientId)
		throw redirect(402, `/approve/${params.bountyId}/`);
	if (isPending && locals.user?.id !== bounty.clientId)
		throw error(403, "You are unauthorized to visit this page at this time");

	bounty.content = sanitizeHtml(await marked(bounty.content || ""));

	return {
		bounty,
	};
}
