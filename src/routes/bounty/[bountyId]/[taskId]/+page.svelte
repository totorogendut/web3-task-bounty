<script lang="ts">
	import { page } from "$app/state";
	import CommentSection from "$lib/components/bounty-page/task-page/CommentSection.svelte";
	import ProgressList from "$lib/components/bounty-page/task-page/ProgressList.svelte";

	const { data } = $props();
</script>

<div class="flex min-h-screen w-full p-4">
	<main class="grow">
		<strong>{data.state?.replace("_", " ")}</strong>
		<h1>{data.bounty?.title}</h1>
		<h2>{data.title}</h2>
		<div class="">
			{data.content}
		</div>
		<svelte:boundary>
			<ProgressList taskId={page.params.taskId || ""} />
			{#snippet pending()}
				Loading...
			{/snippet}
		</svelte:boundary>
	</main>
	<CommentSection commentableType="task" commentableId={page.params.taskId || ""} />
</div>
