<script lang="ts">
	import type { HTMLSelectAttributes } from "svelte/elements";

	interface Props extends HTMLSelectAttributes {
		label: string;
		options: string[];
	}

	let { value = $bindable(), class: className, label, options, ...data }: Props = $props();
</script>

<label class="flex flex-col gap-2 font-semibold">
	{label}
	<select
		bind:value
		class={[
			`border-2! border-amber-700! font-semibold 
  text-amber-800! ring-0! outline-2! outline-white! 
    placeholder:font-medium`,
			className,
		]}
		{...data}
	>
		{#each options as option}
			<option class="first-letter:uppercase" value={option}>{option}</option>
		{/each}
	</select>
</label>
