<script lang="ts">
	import { setContext } from "svelte";
	import TabButton from "../TabButton.svelte";
	import BountyList from "./BountyList.svelte";
	import UnderConstruction from "../NotAvailableMessage.svelte";

	const homePageState: {
		tab: "bounty" | "leaderboard" | "transaction";
	} = $state({
		tab: "bounty",
	});

	setContext("tabState", homePageState);

	function select(name: typeof homePageState.tab) {
		homePageState.tab = name;
	}
</script>

<div
	class="mx-auto mt-16 flex w-300 max-w-full gap-3 text-xl
	font-semibold"
>
	<TabButton onclick={() => select("bounty")} name="bounty">💰 Bounty</TabButton>
	<TabButton onclick={() => select("leaderboard")} name="leaderboard">📈 Leaderboard</TabButton>
	<TabButton onclick={() => select("transaction")} name="transaction">💸 Transaction</TabButton>
</div>

{#if homePageState.tab === "bounty"}
	<BountyList />
{:else}
	<UnderConstruction title="Not available">
		This is an advanced feature meant for beyond hackaton and currently not available in this demo
	</UnderConstruction>
{/if}
