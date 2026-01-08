<script lang="ts">
	import { page } from "$app/state";
	import CommentSection from "$lib/components/bid-page/CommentSection.svelte";
	import BidList from "$lib/components/bounty-page/BidList.svelte";
	import TabButton from "$lib/components/TabButton.svelte";
	import BountyPaper from "$lib/components/bounty-page/BountyPaper.svelte";
	import { parseMarkdown } from "$lib/utils/content";
	import DOMpurify from "dompurify";
	import { browser } from "$app/environment";
	import Avatar from "$lib/components/user/Avatar.svelte";
	import UserBanner from "$lib/components/UserBanner.svelte";
	import SkillTag from "$lib/components/skills/SkillTag.svelte";
	import { setContext } from "svelte";

	const { data } = $props();
	const tabState = $state({
		tab: "description",
	}) as { tab: "description" | "bids" };
	let contentHTML = $state("");

	setContext("tabState", tabState);
	function tabClick(name: typeof tabState.tab) {
		tabState.tab = name;
		console.log(tabState.tab);
	}

	async function parseContent() {
		if (contentHTML) return contentHTML;
		return DOMpurify.sanitize(await parseMarkdown(data.bounty.content || ""));
	}
</script>

<div class="mx-auto mt-40 flex w-300 gap-4">
	<div class="flex grow flex-col gap-4">
		<div class="">
			<h1 class="mt-0! cowboy-text text-5xl">{data.bounty?.title}</h1>
			{#if page.error}
				<div
					class="w-full rounded-md bg-red-700
				p-4 text-white/90"
				>
					{page.error}
				</div>
			{/if}
			<div class="mt-8 mb-5 flex gap-2">
				<TabButton
					onclick={() => tabClick("description")}
					class="rounded-md! px-4! py-1!"
					name="description">Description</TabButton
				>
				<TabButton onclick={() => tabClick("bids")} class="rounded-md! px-4! py-1!" name="bids"
					>Bids</TabButton
				>
			</div>
			{#if tabState.tab === "description"}
				<svelte:boundary>
					<div class="max-w-180 text-lg leading-[1.1]">
						{@html browser ? await parseContent() : ""}
					</div>
					<div class="mt-8 flex gap-1">
						{#each data.bounty?.skills || [] as skill}
							<SkillTag {skill} />
						{/each}
					</div>
					<div class="mt-4 flex items-center gap-2">
						<strong class="mr-2 cowboy-text">Client:</strong>
						{#if data.bounty?.client}
							<UserBanner user={data.bounty.client} />
						{/if}
					</div>
					{#snippet pending()}
						...
					{/snippet}
				</svelte:boundary>
			{:else if tabState.tab === "bids"}
				<BidList bountyId={page.params.bountyId || ""} />
			{/if}
		</div>
	</div>
	<BountyPaper bounty={data.bounty!} />
</div>
