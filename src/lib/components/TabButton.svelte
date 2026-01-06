<script lang="ts">
	import { getContext, type Snippet } from "svelte";

	interface Props {
		name: string;
		class?: string;
		children?: Snippet;
		onclick?: () => void;
	}

	let { name, class: className, children, onclick }: Props = $props();
	const active = $derived((getContext("tabState") as any)?.tab === name);
</script>

<svelte:boundary>
	<button
		{onclick}
		class={[
			"rounded-md bg-amber-700 py-1 pr-4 pl-2",
			active ? "" : "cursor-pointer bg-amber-700/60! hover:bg-amber-600/80!",
			className,
		]}
	>
		{@render children?.()}
	</button>
</svelte:boundary>
