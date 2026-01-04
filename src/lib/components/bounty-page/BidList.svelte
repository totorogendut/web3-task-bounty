<script lang="ts">
	import { getBidList } from "../bid-page/index.remote";
	import Masonry from "../Masonry.svelte";
	import BidListItem from "./BidListItem.svelte";

	interface Props {
		bountyId: string;
	}

	const { bountyId }: Props = $props();
	let isLoading = $state(true);
	let offset = $state(0);
	let list = $state(await getBidList({ bountyId, offset: 0, limit: 100 }));
	isLoading = false;
	offset = list.length;

	async function fetchMoreList() {
		isLoading = true;
		try {
			const more = await getBidList({ bountyId, offset });
			list = [...list, ...more];
			offset += 20;
		} catch (error) {
			console.error("Failed to fetch more bids:", error);
		} finally {
			isLoading = false;
		}
	}
</script>

<svelte:boundary>
	<section class="flex flex-col gap-4">
		{#if list.length === 0}
			<div class="rounded-xl border border-white/10 bg-white/5 p-8 text-center text-white/50">
				No bids found for this bounty.
			</div>
		{:else}
			<Masonry class="grid-cols-2 gap-4 gap-y-8 text-amber-900">
				{#each list as { user, ...data }}
					<BidListItem {...data} {user} />
				{/each}
			</Masonry>
		{/if}
	</section>
</svelte:boundary>
