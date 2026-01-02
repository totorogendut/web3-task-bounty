<script lang="ts">
	import type { Task } from "$lib/server/db/schemas";
	import { getTaskList } from "../home-page/index.remote";

	interface Props {
		list: Task[];
		bountyId: string;
	}

	const { list: taskList, bountyId }: Props = $props();
	let isLoading = $state(true);
	let offset = $state(20);
	let list = $state(taskList);
	isLoading = false;

	async function fetchMoreList() {
		isLoading = true;
		try {
			const more = await getTaskList({ bountyId, offset });
			list = [...list, ...more];
			offset += 20;
		} catch (error) {
			console.error("Failed to fetch more tasks:", error);
		} finally {
			isLoading = false;
		}
	}
</script>

<section class="flex flex-col gap-4">
	{#if list.length === 0}
		<div class="rounded-xl border border-white/10 bg-white/5 p-8 text-center text-white/50">
			No tasks found for this bounty.
		</div>
	{:else}
		<div class="flex flex-col gap-3">
			{#each list as { title, content, id }}
				<a
					href="/task/{id}"
					class="flex flex-col gap-1 rounded-xl bg-white/5 p-4 transition hover:bg-white/10"
				>
					<strong class="text-lg">{title}</strong>
					<p class="line-clamp-2 text-sm text-white/70">{content}</p>
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
