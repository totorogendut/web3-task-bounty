<script lang="ts">
	import BountyList from "./BountyList.svelte";

	let selected = $state<"bounty" | "leaderboard" | "transaction">("bounty");
</script>

{#snippet item(select:typeof selected,str:string)}
	<svelte:boundary>
	{@const active = selected === select}
	<button
	onclick={() => (selected = select)}
	class={[
		"rounded-2xl bg-amber-700 py-3 pr-10 pl-4",
		active ? "" : "cursor-pointer bg-amber-700/60! hover:bg-amber-600/80!",
	]}
	>
	{str}
</button>
</svelte:boundary>
{/snippet}

<div
	class="mx-auto mt-16 flex w-300 max-w-full gap-3 text-xl
	font-semibold"
>

{@render item('bounty','💰 Bounty')}
{@render item('leaderboard','📈 Leaderboard')}
{@render item('transaction','💸 Transaction')}
</div>

{#if selected === "bounty"}
	<BountyList />
{/if}
