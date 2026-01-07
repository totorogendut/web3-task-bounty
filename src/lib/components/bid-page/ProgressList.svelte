<script lang="ts">
	import type { Snippet } from "svelte";

	interface Props {
		bidId: string;
	}

	const { bidId }: Props = $props();
	// svelte-ignore state_referenced_locally
</script>

<div class="mt-4 flex flex-col gap-2">
	{#each [] as item}
		<div></div>
	{/each}
</div>
