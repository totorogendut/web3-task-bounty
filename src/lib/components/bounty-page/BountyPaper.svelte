<script lang="ts">
	import { page } from "$app/state";
	import type { Bounty } from "$lib/server/db/schemas";
	import { Link, Link2 } from "@lucide/svelte";

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
		<div class="flex flex-col leading-[1.2] text-amber-950/90">
			<div class="flex justify-between">
				<strong>Deadline:</strong>
				in 13 days
			</div>
			<div class="flex justify-between">
				<strong>Can refund:</strong>
				{bounty.canRefund ? "Yes" : "No"}
			</div>
			<div class="flex justify-between">
				<strong>Smart contract:</strong>
				<a
					class="flex items-center gap-1 font-bold text-amber-700 underline"
					href={bounty.escrowContractAddress}
				>
					<Link2 size={16} /> link
				</a>
			</div>
			<div class="flex justify-between">
				<strong>Currency:</strong>
				MNEE crypto
			</div>
		</div>
		<span class="mt-6 text-center rye-regular text-amber-800">reward</span>
		<strong
			class="text-center rye-regular text-4xl leading-6 text-green-500
				text-shadow-green-700 text-shadow-sm">${bounty?.rewardAmount}</strong
		>
	</div>
	{#if page.data.user}
		<div class="flex items-center gap-2">
			<a
				class="flex grow items-center justify-center
				 rounded-md bg-amber-600 p-2 font-extrabold
				 	shadow-2xl"
				href="/task/new/{bounty?.id}"
			>
				💰 Take the bounty
			</a>
		</div>
	{:else}
		<div
			class="mx-auto mt-1 w-60 text-center text-lg leading-[1.4]
 underline decoration-dashed decoration-2 underline-offset-5 opacity-80"
		>
			connect wallet to participate in the bounty
		</div>
	{/if}
</div>
