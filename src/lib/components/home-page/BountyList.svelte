<script lang="ts">
	import type { Bounty } from "$lib/server/db/schemas";
	import { getContext } from "svelte";
	import { getBountyList } from "./index.remote";
	import type { bounty } from "$lib/server/db/schemas/tasks";

	let isLoading = $state(false);
	let offset = $state(0);
	let list = $state(await getBountyList({ offset: 0 }));

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
</script>

<svelte:boundary>
	<section class="mt-8 flex flex-col gap-4">
		{#if list.length === 0}
			<div class="rounded-xl border border-white/10 bg-white/5 p-8 text-center text-white/50">
				No bounties found.
			</div>
		{:else}
			<div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
				{#each list as { title, description, id }}
					<a
						href="/bounty/{id}"
						class="flex flex-col gap-2 rounded-2xl bg-white/5 p-6 transition hover:bg-white/10"
					>
						<strong class="text-xl">{title}</strong>
						<p class="line-clamp-2 text-sm text-white/70">{description}</p>
					</a>
				{/each}
			</div>
			<button
				onclick={fetchMoreList}
				disabled={isLoading}
				class="mt-4 self-center rounded-xl bg-amber-600 px-6 py-2 font-semibold transition hover:bg-amber-500 disabled:opacity-50"
			>
				{isLoading ? "Loading..." : "Load More"}
			</button>
		{/if}
	</section>
	{#snippet pending()}
		Test
	{/snippet}
</svelte:boundary>
