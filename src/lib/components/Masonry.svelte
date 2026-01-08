<script lang="ts">
	import type { Snippet } from "svelte";

	interface Props {
		class?: string;
		children?: Snippet;
	}

	const { class: className, children }: Props = $props();
	let container: HTMLDivElement;
</script>

<div class={["grid auto-rows-[8px]", className]} bind:this={container}>
	{@render children?.()}
</div>
