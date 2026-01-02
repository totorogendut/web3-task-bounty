<script lang="ts">
	import type { HTMLInputAttributes } from "svelte/elements";

	interface Props extends HTMLInputAttributes {}

	let { class: className, value = $bindable(), ...data }: Props = $props();
</script>

<input
	class={[
		`border-2! border-amber-700! font-semibold 
  text-amber-800 	ring-0! outline-2! outline-white! 
    placeholder:font-medium`,
		className,
	]}
	bind:value
	{...data}
/>
