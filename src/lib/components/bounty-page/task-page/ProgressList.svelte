<script lang="ts">
	import { getProgress } from "./index.remote";

	import type { Snippet } from "svelte";

	interface Props {
		taskId: string;
	}

	const { taskId }: Props = $props();
	// svelte-ignore state_referenced_locally
	const list = await getProgress({ taskId, offset: 0, limit: 100 });
</script>

<div class="mt-4 flex flex-col gap-2">
	{#each list as item}
		<div></div>
	{/each}
</div>
