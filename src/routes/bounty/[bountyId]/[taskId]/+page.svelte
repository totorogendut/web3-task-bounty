<script lang="ts">
	import { page } from "$app/state";
	import CommentSection from "$lib/components/bounty-page/task-page/CommentSection.svelte";

	const { data } = $props();
</script>

<div class="flex min-h-screen w-full p-4">
	<main class="grow">
		<h1>{data.bounty?.title}</h1>
	</main>
	<CommentSection commentableType="task" commentableId={page.params.taskId || ""} />
</div>
