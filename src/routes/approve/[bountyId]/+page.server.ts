import type { EscrowStatus } from "$lib/_eth-shared";
import { db } from "$lib/server/db";
import { isBountyContractPending, isEscrowApprovalPending } from "$lib/utils/escrow.js";
import { error, redirect } from "@sveltejs/kit";

export async function load({ params, locals }) {
	const bounty = await db.query.bounty.findFirst({
		where: {
			id: params.bountyId || "",
		},
	});

	if (!bounty) throw error(404, "No bounty post found");
	const isPending =
		isEscrowApprovalPending(bounty.escrowStatus as EscrowStatus) ||
		isBountyContractPending(bounty.escrowStatus as EscrowStatus);
	if (!isPending) throw redirect(302, `/bounty/${params.bountyId}/`);
	if (isPending && locals.user?.id !== bounty.clientId)
		throw error(403, "You are unauthorized to visit this page at this time");

	return {
		bounty,
	};
}
