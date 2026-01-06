<script lang="ts">
	import { Check, Download, DownloadCloud } from "@lucide/svelte";
	import BidCTAButton from "./BidCTAButton.svelte";
	import { approveBid, downloadBidAttachment } from "$lib/api/bounty.remote";
	import Modal from "../ModalDialog.svelte";
	import type { Bid } from "$lib/server/db/schemas";
	import { PUBLIC_S3_ENDPOINT } from "$env/static/public";

	interface Props {
		id: string;
		bid: Bid;
	}

	const { id, bid }: Props = $props();
	let openApproveModal = $state(false);
	let openAttachmentsModal = $state(false);
</script>

<BidCTAButton onclick={() => (openAttachmentsModal = true)}>
	<Download size={20} />
</BidCTAButton>
<BidCTAButton onclick={() => (openApproveModal = true)}>
	<Check size={20} />
</BidCTAButton>

{#if openApproveModal}
	<Modal
		onYes={() => {
			// console.log("Yes");
		}}
		onClose={() => (openApproveModal = false)}
	>
		<strong class="text-xl leading-none">Are you sure you want to grant bounty?</strong>
		<p class="mt-4 text-lg">
			This will end your bounty and release the payment. Might requires a gas fee.
		</p>
	</Modal>
{/if}
{#if openAttachmentsModal}
	<Modal hasOptions={false} onClose={() => (openAttachmentsModal = false)}>
		<strong class="text-xl leading-none">This bid's attachments</strong>
		<div class="mt-4 grid grid-cols-1 gap-2">
			{#each bid.attachments as attachment}
				{@const url = `${PUBLIC_S3_ENDPOINT}/${attachment}`}
				<a
					class="line-clamp-1 rounded-md bg-slate-200 px-2
					py-1 hover:brightness-95"
					target="_blank"
					href={url}>{url.split("/").slice(-1)}</a
				>
			{/each}
		</div>
	</Modal>
{/if}
