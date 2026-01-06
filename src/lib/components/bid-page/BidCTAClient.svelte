<script lang="ts">
	import { Check, Download, DownloadCloud } from "@lucide/svelte";
	import BidCTAButton from "./BidCTAButton.svelte";
	import { approveBid, downloadBidAttachment } from "$lib/api/bounty.remote";
	import Modal from "../ModalDialog.svelte";

	interface Props {
		id: string;
	}

	const { id }: Props = $props();
	let openApproveModal = $state(false);
</script>

<BidCTAButton onclick={() => downloadBidAttachment({ id })}>
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
