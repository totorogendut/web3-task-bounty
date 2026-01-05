<script lang="ts">
	import { page } from "$app/state";
	import BidCTAClient from "$lib/components/bid-page/BidCTAClient.svelte";
	import BidCTAHunter from "$lib/components/bid-page/BidCTAHunter.svelte";
	import CommentSection from "$lib/components/bid-page/CommentSection.svelte";
	import ProgressList from "$lib/components/bid-page/ProgressList.svelte";
	import SkillTag from "$lib/components/skills/SkillTag.svelte";
	import UserBanner from "$lib/components/UserBanner.svelte";
	import { isLocalUser } from "$lib/user.svelte.js";

	const { data } = $props();
</script>

<div class="flex min-h-screen w-full gap-8 p-4">
	<main class="mt-12 grow">
		<strong>{data.state?.replace("_", " ")}</strong>
		<h1 class="mt-2! cowboy-text">{data.bounty?.title}</h1>
		<div class="">
			{data.content}
		</div>
		<div class="mt-4 mb-6 flex flex-wrap gap-1">
			{#each data.bounty?.skills as skill}
				<SkillTag {skill} />
			{/each}
		</div>
		<div class="flex items-center justify-between">
			{#if data.user}
				<UserBanner user={data.user} />
			{/if}
			{#if isLocalUser(data.user?.id)}
				<BidCTAHunter content={data.content} />
			{/if}
			{#if isLocalUser(data.bounty?.clientId)}
				<BidCTAClient id={data.id} />
			{/if}
		</div>
	</main>
	<CommentSection commentableType="bid" commentableId={page.params.bidId || ""} />
</div>
