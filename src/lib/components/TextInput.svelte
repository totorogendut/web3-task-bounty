<script lang="ts">
	import type { HTMLInputAttributes } from "svelte/elements";

	interface Props extends HTMLInputAttributes {
		label?: string;
	}

	let { label, value = $bindable(), ...data }: Props = $props();
</script>

{#snippet input()}
	<input
		class={[
			`border-2! border-amber-700! font-semibold 
  text-amber-800 	ring-0! outline-2! outline-white! 
    placeholder:font-medium`,
			data.class,
		]}
		bind:value
		{...data}
	/>
{/snippet}

{#if label}
	<label class="flex flex-col gap-2">
		<strong class="text-shadow-lg"> {label} </strong>
		{@render input()}
	</label>
{:else}
	{@render input()}
{/if}
