<script lang="ts">
	import { X } from "@lucide/svelte";
	import { skills } from "./skills/skills-template";
	import TextInput from "./TextInput.svelte";
	import { derived } from "svelte/store";

	// Available tags (can be async later)

	let selectedTags = $state<string[]>([]);
	let query = $state("");
	let showSuggestions = $state(false);
	let skillsArrayString = $derived(JSON.stringify(selectedTags));
	const length = $derived({
		current: selectedTags.length,
		max: 7,
	});

	const filteredTags = $derived(
		skills
			.filter(
				(tag) => tag.toLowerCase().includes(query.toLowerCase()) && !selectedTags.includes(tag),
			)
			.slice(0, 10),
	);

	function addTag(tag: string) {
		if (!tag || selectedTags.includes(tag)) return;
		selectedTags = [...selectedTags, tag];
		query = "";
		showSuggestions = false;
	}

	function removeTag(tag: string) {
		selectedTags = selectedTags.filter((t) => t !== tag);
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === "," || e.key === "Enter") {
			e.preventDefault();
			addTag(query.replace(",", "").trim());
		}
	}
</script>

<input type="hidden" name="skills" bind:value={skillsArrayString} />

<div class="relative w-full">
	<div class="flex items-center gap-4">
		<TextInput
			label="Skills prefered ({length.current}/{length.max})"
			placeholder="Type and press comma"
			class="w-100"
			bind:value={query}
			oninput={() => (showSuggestions = true)}
			onkeydown={handleKeydown}
		/>
		<div class="flex h-12 w-50 grow flex-wrap items-start gap-2 gap-y-1 self-end">
			{#each selectedTags as tag}
				<span
					class="inline-flex items-center gap-2 gap-y-1 rounded-full
					 bg-amber-600 py-0.5 pr-2 pl-3 text-sm text-amber-200"
				>
					{tag}
					<button
						type="button"
						class="cursor-pointer text-amber-400/90 hover:text-amber-300"
						onclick={() => removeTag(tag)}
					>
						<X size={16} />
					</button>
				</span>
			{/each}
		</div>
	</div>

	{#if showSuggestions && query && filteredTags.length && length.current < length.max}
		<div
			class="absolute -left-1.5 z-10 mt-3 w-full max-w-md rounded-sm
			border border-slate-200 bg-white text-amber-900 shadow"
		>
			{#each filteredTags as tag}
				<button
					type="button"
					class="cursor-pointer px-3 py-2 text-sm hover:bg-amber-100/40"
					onclick={() => length.current < length.max && addTag(tag)}
				>
					{tag}
				</button>
			{/each}
		</div>
	{/if}
</div>
