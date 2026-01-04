<script lang="ts">
	import { X } from "@lucide/svelte";

	interface Props {
		skill: string;
		canRemove?: boolean;
		onRemove?: (skill: string) => void;
	}

	const { skill, canRemove = false, onRemove }: Props = $props();
</script>

<button
	onclick={() => onRemove?.(skill)}
	class="rounded-sm bg-amber-400/90 px-2
	text-sm font-semibold text-amber-900/70"
	>{skill}
	{#if canRemove}
		<X />
		<!-- content here -->
	{/if}
</button>
