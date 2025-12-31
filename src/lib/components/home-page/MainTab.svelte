<script lang="ts">
	import { getContext } from "svelte";
	import BountyList from "./BountyList.svelte";

	let selected = $state<"bounty" | "leaderboard" | "transaction">("bounty");
</script>

<div
	class="mx-auto mt-16 flex w-300 max-w-full gap-3 text-xl
	font-semibold"
>
	<button class={["rounded-2xl bg-amber-700 py-3 pr-10 pl-4"]}> 💰 Bounty</button>
	<button class={["rounded-2xl bg-amber-700 py-3 pr-10 pl-4"]}> 📈 Leaderboard</button>
	<button class={["rounded-2xl bg-amber-700 py-3 pr-10 pl-4"]}> 💸 Transactions</button>
</div>

{#if selected === "bounty"}
	<BountyList />
{/if}
