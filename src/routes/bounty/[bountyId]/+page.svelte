<script lang="ts">
	import { page } from "$app/state";
	import CommentSection from "$lib/components/task-page/CommentSection.svelte";
	import TaskList from "$lib/components/bounty-page/TaskList.svelte";

	const { data } = $props();
</script>

<div class="flex w-full">
	<div class="sticky top-0">
		<h1>{data.bounty?.title}</h1>
		<div>
			{data.bounty?.description}
		</div>
	</div>
	<TaskList bountyId={page.params.bountyId || ""} list={data.bounty?.tasks || []} />
</div>
