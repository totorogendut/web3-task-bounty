<script lang="ts">
	import { onMount } from "svelte";

	import type { Snippet } from "svelte";

	interface Props {
		class?: string;
		children?: Snippet;
	}

	const { class: className, children }: Props = $props();
	let container: HTMLDivElement;

	function resizeAll() {
		const rowHeight = 10;
		const gap = 10;

		for (const item of container.children) {
			const content = item.firstElementChild as HTMLElement;
			const height = content.getBoundingClientRect().height;
			const span = Math.ceil((height + gap) / (rowHeight + gap));
			(item as HTMLElement).style.gridRowEnd = `span ${span}`;
		}
	}

	onMount(() => {
		resizeAll();
		window.addEventListener("resize", resizeAll);
		return () => window.removeEventListener("resize", resizeAll);
	});
</script>

<div class={["masonry", className]} bind:this={container}>
	{@render children?.()}
</div>

<style>
	.masonry {
		display: grid;
	}

	.masonry > * {
		overflow: hidden;
	}
</style>
