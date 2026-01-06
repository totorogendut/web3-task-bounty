<script lang="ts">
	import type { Bounty } from "$lib/server/db/schemas";
	import { format, formatDistance, formatRelative, subDays } from "date-fns";
	import SkillTag from "../skills/SkillTag.svelte";

	interface Props extends Bounty {}
	const { id, title, rewardAmount, description, deadline, skills }: Props = $props();

	const expiredAt = deadline
		? formatDistance(deadline, new Date(), { addSuffix: true })
		: "Indefinitely";
	const isExpired = $derived(deadline && Date.now() > deadline?.getTime());
</script>

<a
	href="/bounty/{id}"
	class="relative flex flex-col gap-2 self-start rounded-2xl
		   bg-black/15 p-6 pb-3 transition hover:bg-black/10"
>
	<strong class="text-xl">{title} </strong>
	<p class="line-clamp-3 text-sm text-white/70">{description}</p>
	<span
		class={[
			"reward absolute top-2 right-4 rye-regular font-extrabold text-green-300",
			isExpired && "line-through grayscale-50 saturate-70",
		]}
		>${rewardAmount}
	</span>
	<div class="mb-2 flex flex-wrap items-start gap-1">
		{#each skills || [] as skill}
			<SkillTag {skill} />
		{/each}
	</div>
	<small class={[isExpired ? "text-red-300/80" : "mt-2 text-white/60"]}>
		{isExpired ? "Expired..." : expiredAt}
	</small>
</a>

<style>
	.reward {
		text-shadow: 2px 2px var(--color-green-600);
	}
</style>
