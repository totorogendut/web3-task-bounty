<script lang="ts">
	import { page } from "$app/state";
	import CommentSection from "$lib/components/task-page/CommentSection.svelte";
	import TaskList from "$lib/components/bounty-page/TaskList.svelte";
	import TabButton from "$lib/components/TabButton.svelte";
	import { setTabState } from "$lib/components/_shared.svelte.js";
	import BountyPaper from "$lib/components/bounty-page/BountyPaper.svelte";
	import { parseMarkdown } from "$lib/utils/content";
	import DOMpurify from "dompurify";
	import { browser } from "$app/environment";

	const { data } = $props();
	const tabState = $state({
		selectedTab: "description",
	}) as { selectedTab: "description" | "taskList" };

	setTabState(tabState);
</script>

<div class="mx-auto mt-40 flex w-300 gap-4">
	<div class="flex grow flex-col gap-4">
		<div class="">
			<h1 class="mt-0! cowboy-text text-5xl">{data.bounty?.title}</h1>
			<div class="mt-8 mb-5 flex gap-2">
				<TabButton class="rounded-md! px-4! py-1!" name="description">Description</TabButton>
				<TabButton class="rounded-md! px-4! py-1!" name="taskList">Hunters</TabButton>
			</div>
			{#if tabState.selectedTab === "description"}
				<svelte:boundary>
					<div class="max-w-180 text-lg leading-[1.1]">
						{@html browser
							? DOMpurify.sanitize(await parseMarkdown(data.bounty.content || ""))
							: ""}
					</div>
					{#snippet pending()}
						...
					{/snippet}
				</svelte:boundary>
			{:else if tabState.selectedTab === "taskList"}
				<TaskList bountyId={page.params.bountyId || ""} list={data.bounty?.tasks || []} />
			{/if}
		</div>
	</div>
	<BountyPaper bounty={data.bounty!} />
</div>
