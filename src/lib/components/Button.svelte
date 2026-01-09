<script lang="ts">
	import type { Snippet } from "svelte";
	import type { HTMLButtonAttributes } from "svelte/elements";

	interface Props extends HTMLButtonAttributes {
		children?: Snippet;
	}

	const { children, ...data }: Props = $props();
</script>

<button
	type={data.type || "button"}
	class={[
		`not-disabled-hover:-translate-y-0.5 not-disabled-hover:bg-amber-600 
      not-disabled-active:translate-y-0
			rounded-md bg-amber-700 px-4 py-2 font-bold shadow-lg
			not-disabled:cursor-pointer hover:-translate-y-0.5
			active:translate-y-0 disabled:grayscale-75`,
		data.class,
	]}
	{...data}
>
	{@render children?.()}
</button>
