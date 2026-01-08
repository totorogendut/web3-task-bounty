<script lang="ts">
	import type { Bid, Bounty } from "$lib/server/db/schemas";
	import { isLocalUser, type UserClient } from "$lib/user.svelte";
	import UserBanner from "../UserBanner.svelte";
	import BidCTAHunter from "../bid-page/BidCTAHunter.svelte";
	import BidCTAClient from "../bid-page/BidCTAClient.svelte";
	import { page } from "$app/state";
	import { editBid } from "$lib/api/bounty.remote";
	import { Trophy } from "@lucide/svelte";

	interface Props extends Bid {
		user: UserClient | null | undefined;
		bounty?: Bounty;
	}

	const { id, content: textContent, user, ...data }: Props = $props();
	let content = $state(textContent);
	const bounty: Bounty = $derived(data?.bounty || page.data.bounty);
</script>

<div class="relative flex flex-col gap-1 self-start">
	<div class="peer absolute right-0 bottom-0">
		{#if isLocalUser(user?.id)}
			<BidCTAHunter
				onEdit={async (text) => {
					const prevContent = content;
					content = text;
					try {
						await editBid({ id, content });
					} catch (error) {
						content = prevContent;
					}
				}}
				{content}
			/>
		{/if}
		{#if isLocalUser(bounty?.clientId)}
			<BidCTAClient bid={{ id, content, ...data }} {id} />
		{/if}
	</div>
	<div
		class="rounded-md bg-amber-50 p-3 text-sm text-amber-900
		outline-amber-600 peer-hover:outline-4"
	>
		{#if bounty.winningBidId === id}
			<div
				class="mb-2 flex w-fit items-center
				gap-2 rounded-full bg-amber-600 py-1 pr-4 pl-3 font-bold text-white"
			>
				<Trophy size={18} />
				WIN
			</div>
		{/if}
		{content}
	</div>
	<div class="mt-1 flex items-center gap-2">
		<strong class="mr-2 cowboy-text">Hunter:</strong>
		{#if user}
			<UserBanner {user} />
		{/if}
	</div>
</div>
