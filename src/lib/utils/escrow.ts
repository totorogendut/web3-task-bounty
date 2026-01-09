import type { EscrowStatus } from "$lib/_eth-shared";

export function isEscrowApprovalPending(escrowStatus: string) {
	const approvalPending = ["approval_pending", "approval_reverted"] as Array<EscrowStatus>;

	return approvalPending.includes(escrowStatus as EscrowStatus);
}
export function isBountyContractPending(escrowStatus: string) {
	const approvalPending = [
		"mint_reverted",
		"mint_pending",
		"approval_success",
	] as Array<EscrowStatus>;

	return approvalPending.includes(escrowStatus as EscrowStatus);
}
