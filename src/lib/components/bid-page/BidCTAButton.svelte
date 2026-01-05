<script lang="ts">
	import type { Snippet } from "svelte";
	import type { HTMLButtonAttributes } from "svelte/elements";

	interface Props extends HTMLButtonAttributes {
		children: Snippet;
	}

	const { children, ...data }: Props = $props();
</script>

<button
	{...data}
	class={[
		`cursor-pointer rounded-full p-1.5 text-amber-300/80 
  hover:bg-amber-300/20 hover:text-amber-200`,
		data.class,
	]}
>
	{@render children()}
</button>
