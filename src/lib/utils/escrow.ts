import type { EscrowStatus } from "$lib/_eth-shared";

export function isEscrowApprovalPending(escrowStatus: string) {
	const approvalPending = ["approval pending", "approval reverted"] as Array<EscrowStatus>;

	return approvalPending.includes(escrowStatus as EscrowStatus);
}
export function isBountyContractPending(escrowStatus: string) {
	const approvalPending = [
		"mint reverted",
		"mint pending",
		"approval success",
	] as Array<EscrowStatus>;

	return approvalPending.includes(escrowStatus as EscrowStatus);
}
