<script lang="ts">
	import { page } from "$app/state";
	import CommentSection from "$lib/components/bounty-page/task-page/CommentSection.svelte";
	import TaskList from "$lib/components/bounty-page/TaskList.svelte";

	const { data } = $props();
</script>

<div class="flex w-full">
	<TaskList bountyId={page.params.bountyId || ""} list={data.taskList} />
	<CommentSection commentableType="bounty" commentableId={page.params.bountyId || ""} />
</div>
