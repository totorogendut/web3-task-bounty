<script lang="ts">
	import { skills as skillsDemo } from "$lib/components/skills/skills-template.js";
	import SkillTag from "$lib/components/skills/SkillTag.svelte";
	import Avatar from "$lib/components/user/Avatar.svelte";
	import { isLocalUser } from "$lib/user.svelte.js";
	import { CircleFadingPlus, PlusCircle, PlusSquare } from "@lucide/svelte";

	const banner = $state("/sunset-bg.webp");
	const { data } = $props();
	const skills = $derived(skillsDemo.slice(5, 10));
</script>

<div class="mx-auto mt-20 flex w-240 flex-col">
	<div class="banner relative h-100 w-full overflow-hidden rounded-md bg-amber-600">
		<img src={banner} alt="Banner" />
		<div
			class="absolute right-0 bottom-0 h-30 w-full
      bg-linear-to-t from-black/55 to-black/0"
		></div>
	</div>
	<div class="relative -mt-23 flex flex-col items-center">
		<Avatar user={data.user} />
		<strong>{data.user.username}</strong>
	</div>
	<div class="mt-8 flex gap-4">
		<div class="w-72">
			<strong class="cowboy-text text-2xl">Skills</strong>
			<div class="mt-3 flex min-h-8 flex-wrap gap-1">
				{#each skills as skill}
					<SkillTag {skill} />
				{/each}
			</div>
			{#if isLocalUser(data.user.id)}
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
	</div>
</div>
