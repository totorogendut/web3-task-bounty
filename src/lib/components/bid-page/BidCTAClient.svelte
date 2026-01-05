<script lang="ts">
	import { Check, Download, DownloadCloud } from "@lucide/svelte";
	import BidCTAButton from "./BidCTAButton.svelte";
	import { approveBid, downloadBidAttachment } from "$lib/api/bounty.remote";

	interface Props {
		id: string;
	}

	const { id }: Props = $props();
</script>

<BidCTAButton onclick={() => downloadBidAttachment({ id })}>
	<Download size={20} />
</BidCTAButton>
<BidCTAButton onclick={() => approveBid({ id })}>
	<Check size={20} />
</BidCTAButton>
