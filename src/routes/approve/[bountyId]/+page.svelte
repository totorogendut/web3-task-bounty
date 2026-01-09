<script lang="ts">
	import { dev } from "$app/environment";
	import { goto } from "$app/navigation";
	import { tokens, type EscrowStatus, type TokenSymbol } from "$lib/_eth-shared";
	import Button from "$lib/components/Button.svelte";
	import Spinner from "$lib/components/ui/spinner/spinner.svelte";
	import { approveSpendingCap, createBounty, publicClient } from "$lib/contracts.svelte.js";
	import { daysAfter } from "$lib/utils/date.js";
	import { isBountyContractPending, isEscrowApprovalPending } from "$lib/utils/escrow.js";
	import { changeEscrowStatus, waitCreatingContract } from "./approve.remote.js";

	const { data } = $props();
	const { bounty } = data;

	let escrowStatus: EscrowStatus = $state(bounty.escrowStatus!);
	let isApprovalPending = $derived(isEscrowApprovalPending(escrowStatus as EscrowStatus));
	let isContractPending = $derived(isBountyContractPending(escrowStatus as EscrowStatus));
	let isBusy = $state(false);
	let isWaitingForContract = $state(false);
	const token = dev
		? tokens.testnet.wethSepolia
		: tokens.mainnet[bounty.rewardCurrency as TokenSymbol];

	async function createContract() {
		try {
			isBusy = true;
			changeStatus("mint_pending");
			const hash = await createBounty(
				{
					bountyId: bounty.id,
					reward: bounty.rewardAmount,
					deadline: bounty.deadline!,
				},
				token,
			);
			isWaitingForContract = true;

			const tx = await waitCreatingContract({ id: bounty.id, hash });
			if (tx.success) {
				goto(`/bounty/${bounty.id}/`);
				return;
			}
		} finally {
			escrowStatus === "mint_reverted";
			isBusy = false;
		}
	}

	async function approve() {
		try {
			isBusy = true;
			const tx = await approveSpendingCap(bounty.rewardAmount, token);
			if (tx.status === "success") {
				changeStatus("approval_success");
			} else {
				changeStatus("approval_reverted");
			}
		} catch (error) {
			changeStatus("approval_reverted");
		} finally {
			isBusy = false;
		}
	}

	function changeStatus(status: EscrowStatus) {
		changeEscrowStatus({ id: bounty.id, escrowStatus: status });
		escrowStatus = status;
	}

	$effect(() => {
		if (escrowStatus === "bid_open") goto(`/bounty/${bounty.id}/`);
	});
</script>

{#snippet coin()}
	<div class="relative flex h-8 items-center gap-2 font-bold">
		<strong>{bounty.rewardAmount}</strong>
		<enhanced:img
			width="32"
			class="rounded-full"
			src={tokens.mainnet[bounty.rewardCurrency!]?.icon!}
			alt={bounty.rewardCurrency}
		/>
		<span class="uppercase">{bounty.rewardCurrency}</span>
	</div>
{/snippet}

<div
	class="relative isolate mx-auto mt-60
	w-124 rounded-md bg-linear-to-br/oklch from-red-600/60 to-amber-700
	 p-4 backdrop-brightness-10"
>
	<h1 class="mt-1! text-4xl leading-[0.85]! text-shadow-lg">Approve smart contract</h1>
	<img class="absolute -right-30 bottom-0 z-0 h-100 w-auto" src="/cat-cowboy.webp" alt="Cowboy" />
	<div class="relative z-10 flex w-100 flex-col gap-4">
		{#if isApprovalPending}
			<span> Before continuing, you need to approve spending cap </span>
			{@render coin()}
			{#if isBusy}
				<div
					class="flex w-fit items-center gap-2 rounded-md border-2 border-transparent
					 bg-amber-400 px-3 py-2 font-semibold text-black/90"
				>
					<Spinner />
					Don't close the page....
				</div>
			{:else}
				<Button
					class="rounded-md border-2 border-amber-600 bg-white! 
					text-amber-900/90"
					disabled={isBusy}
					onclick={approve}>Approve spending</Button
				>
			{/if}
		{:else if isContractPending}
			<span> Create smart contract for your bounty </span>
			{@render coin()}
			{#if isBusy}
				<div
					class="flex w-fit items-center gap-2 rounded-md border-2 border-transparent
					 bg-amber-400 px-3 py-2 font-semibold text-black/90"
				>
					<Spinner />
					Creating smart contract....
				</div>
			{:else}
				<Button
					class="rounded-md border-2 border-amber-600 bg-white! 
					text-amber-900/90"
					disabled={isBusy}
					onclick={createContract}>Create smart contract</Button
				>
			{/if}
		{/if}
	</div>
</div>
