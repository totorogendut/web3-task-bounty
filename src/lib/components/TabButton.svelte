<script lang="ts">
	import { getContext, type Snippet } from "svelte";
	import { getTabState } from "./_shared.svelte";

	interface Props {
		name: string;
		class?: string;
		children?: Snippet;
	}

	const state = getTabState();
	let { name, class: className, children }: Props = $props();
	const active = $derived(state.selectedTab === name);
</script>

<svelte:boundary>
	<button
		onclick={() => (state.selectedTab = name)}
		class={[
			"rounded-2xl bg-amber-700 py-3 pr-10 pl-4",
			active ? "" : "cursor-pointer bg-amber-700/60! hover:bg-amber-600/80!",
			className,
		]}
	>
		{@render children?.()}
	</button>
</svelte:boundary>
