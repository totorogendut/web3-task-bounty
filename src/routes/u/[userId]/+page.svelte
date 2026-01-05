<script lang="ts">
	import { getBidList } from "$lib/components/bid-page/index.remote";
	import BidListItem from "$lib/components/bounty-page/BidListItem.svelte";
	import Masonry from "$lib/components/Masonry.svelte";

	import TabButton from "$lib/components/TabButton.svelte";
	import UserSkills from "$lib/components/user-page/UserSkills.svelte";
	import Avatar from "$lib/components/user/Avatar.svelte";
	import { setContext } from "svelte";

	const banner = $state("/sunset-bg.webp");
	const { data } = $props();

	const tabState: {
		tab: "bids" | "bounties";
	} = $state({
		tab: "bids",
	});

	setContext("tabState", tabState);

	async function getBidListForUser() {
		return await getBidList({ offset: 0, limit: 100, userId: data.user.id });
	}
</script>

<div class="mx-auto mt-20 flex w-240 flex-col">
	<div class="banner relative h-100 w-full overflow-hidden rounded-md bg-amber-600">
		<img src={banner} alt="Banner" />
		<div
			class="absolute right-0 bottom-0 h-30 w-full
      bg-linear-to-t from-black/55 to-black/0"
		></div>
	</div>
	<div class="relative -mt-23 flex flex-col items-center">
		<Avatar user={data.user} />
		<strong>{data.user.username}</strong>
	</div>

	<div class="mt-8 flex gap-4">
		<UserSkills user={data.user} />
		<div>
			<div class="flex gap-1">
				<TabButton
					class="rounded-md! py-2! pr-8! pl-4! leading-none"
					onclick={() => (tabState.tab = "bids")}
					name="bids">Bids</TabButton
				>
				<TabButton
					class="rounded-md! py-2! pr-8! pl-4! leading-none"
					onclick={() => (tabState.tab = "bounties")}
					name="bounties">Bounties</TabButton
				>
			</div>
			{#if tabState.tab === "bids"}
				<Masonry class="gap4 mt-8 grow grid-cols-2 gap-x-4 gap-y-8 text-amber-900">
					{#each await getBidListForUser() as bidData}
						<BidListItem {...bidData} />
					{/each}
				</Masonry>
			{:else if tabState.tab === "bounties"}
				...
			{/if}
			<svelte:boundary></svelte:boundary>
		</div>
	</div>
</div>
