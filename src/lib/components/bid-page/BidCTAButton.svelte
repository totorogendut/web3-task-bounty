<script lang="ts">
	import type { Snippet } from "svelte";
	import type { HTMLButtonAttributes } from "svelte/elements";

	interface Props extends HTMLButtonAttributes {
		children: Snippet;
	}

	const { children, class: className, ...data }: Props = $props();
</script>

<button
	{...data}
	class={[
		`cursor-pointer rounded-full p-1.5 text-amber-300/80 
  group-hover/bid:bg-amber-300/35 group-hover/bid:text-amber-100/90
	 hover:bg-amber-300/60 	hover:text-white`,
		className,
	]}
>
	{@render children()}
</button>
