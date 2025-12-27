<script lang="ts">
	import { page } from "$app/state";
	import CommentSection from "$lib/components/bounty-page/task-page/CommentSection.svelte";
</script>

<CommentSection commentableType="task" commentableId={page.params.taskId || ""} />
