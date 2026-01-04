<script lang="ts">
	import { skills } from "./skills-template";
	import { SkillsTag } from "./skills.svelte";
	import type { Snippet } from "svelte";

	interface Props {
		onSelect?: (skill: string) => void;
	}

	const { onSelect }: Props = $props();
	const state = new SkillsTag();
</script>

<div class="w-60 max-w-md self-end text-amber-900">
	<input
		type="text"
		placeholder="Search skills..."
		bind:value={state.query}
		class="w-full rounded-md border px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
	/>

	{#if state.query && state.filteredSkills.length > 0}
		<ul class="mt-2 max-h-60 overflow-auto rounded-md border bg-white shadow">
			{#each state.filteredSkills as skill (skill)}
				<li
					onclick={() => onSelect?.(skill)}
					class="cursor-pointer px-3 py-2 text-sm
             hover:bg-indigo-50"
				>
					{skill}
				</li>
			{/each}
		</ul>
	{:else if state.query}
		<p class="mt-2 text-sm text-gray-500">No skills found</p>
	{/if}
</div>
