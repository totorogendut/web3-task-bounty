<script lang="ts">
	import type { Bounty } from "$lib/server/db/schemas";

	interface Props {
		bounty: Bounty;
	}

	const { bounty }: Props = $props();
</script>

<div class="flex flex-col gap-4">
	<div
		class={[
			`flex w-75 flex-col gap-2 self-start rounded-sm
			p-4 text-black/90`,
			// "bg-linear-to-b/oklch from-amber-200 to-amber-300",
			"bg-amber-300 shadow-[4px_4px_var(--color-amber-500)]",
		]}
	>
		<span class="text-center rye-regular text-amber-800">reward</span>
		<strong
			class="text-center rye-regular text-4xl leading-6 text-green-500
				text-shadow-green-700 text-shadow-sm">${bounty?.rewardAmount}</strong
		>
	</div>
	<div class="flex items-center gap-2">
		<a
			class="flex grow items-center rounded-md
			bg-amber-600 p-2 font-extrabold"
			href="/task/new/{bounty?.id}"
		>
			Take bounty
		</a>
	</div>
</div>
