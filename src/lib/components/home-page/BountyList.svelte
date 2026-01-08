<script lang="ts">
	import type { Bounty } from "$lib/server/db/schemas";
	import { getContext } from "svelte";
	import { getBountyList } from "./index.remote";
	import SkeletonShell from "../bid-page/SkeletonShell.svelte";
	import BountyListItem from "./BountyListItem.svelte";
	import Masonry from "svelte-bricks";

	let isLoading = $state(false);
	let offset = $state(0);
	let list = $state(await getBountyList({ offset: 0 }));

	$inspect(list);

	async function fetchMoreList() {
		isLoading = true;
		try {
			const nextOffset = offset + 10;
			const more = await getBountyList({ offset: nextOffset });
			list = [...list, ...more];
			offset = nextOffset;
		} catch (error) {
			console.error("Failed to fetch more bounties:", error);
		} finally {
			isLoading = false;
		}
	}

	let [minColWidth, maxColWidth, gap] = [300, 400, 12];
	let width = $state(0),
		height = $state(0);
</script>

<svelte:boundary>
	<section class="mx-auto mt-8 flex w-300 max-w-full flex-col gap-4">
		{#if list.length === 0}
			<div class="rounded-xl border border-white/10 bg-black/15 p-8 text-center text-white/50">
				No bounties found.
			</div>
		{:else}
			<Masonry
				class="items-start justify-start"
				{minColWidth}
				{maxColWidth}
				{gap}
				items={list}
				bind:masonryWidth={width}
				bind:masonryHeight={height}
			>
				{#snippet children({ item })}
					<BountyListItem {...item} />
				{/snippet}
			</Masonry>

			<button
				onclick={fetchMoreList}
				disabled={isLoading}
				class="mt-4 self-center rounded-xl bg-amber-600 px-6 py-2 font-semibold transition hover:bg-amber-500 disabled:opacity-50"
			>
				{isLoading ? "Loading..." : "Load More"}
			</button>
		{/if}
	</section>
</svelte:boundary>
