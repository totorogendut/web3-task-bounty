<script lang="ts">
	import type { HTMLInputAttributes, HTMLTextareaAttributes } from "svelte/elements";

	interface Props extends HTMLTextareaAttributes {
		label?: string;
	}

	let { label, class: className, value = $bindable(), ...data }: Props = $props();
</script>

{#snippet input()}
	<textarea
		class={[
			`min-h-24 border-2! border-amber-700! 
  font-semibold 	text-amber-800 ring-0! outline-2! 
    outline-white! placeholder:font-medium`,
			className,
		]}
		bind:value
		{...data}
	></textarea>
{/snippet}

{#if label}
	<label class="flex flex-col gap-2">
		<strong class="text-shadow-lg"> {label} </strong>
		{@render input()}
	</label>
{:else}
	{@render input()}
{/if}
