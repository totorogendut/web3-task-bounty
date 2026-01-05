<script lang="ts">
	import SkillTag from "../skills/SkillTag.svelte";
	import { browser } from "$app/environment";
	import { skills as skillsDemo } from "$lib/components/skills/skills-template.js";
	import { isLocalUser, type UserClient } from "$lib/user.svelte.js";
	import { CircleFadingPlus } from "@lucide/svelte";
	import type { Snippet } from "svelte";

	interface Props {
		user: UserClient;
	}

	const { user }: Props = $props();
	const skills = $derived(skillsDemo.slice(5, 10));
</script>

<div class="w-72">
	<strong class="cowboy-text text-2xl">Skills</strong>
	<div class="mt-3 flex min-h-8 flex-wrap gap-1">
		{#each skills as skill}
			<SkillTag {skill} />
		{/each}
	</div>
	{#if isLocalUser(user.id)}
		<button
			class="mx-auto mt-4 flex cursor-pointer flex-col
					items-center gap-1 text-amber-100
					hover:text-amber-300"
		>
			<CircleFadingPlus size={32} />
			add skills
		</button>
	{/if}
</div>
