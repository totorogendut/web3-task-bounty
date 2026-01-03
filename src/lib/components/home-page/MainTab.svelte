<script lang="ts">
	import { setContext } from "svelte";
	import TabButton from "../TabButton.svelte";
	import BountyList from "./BountyList.svelte";
	import { setTabState } from "../_shared.svelte";
	import UnderConstruction from "../NotAvailableMessage.svelte";

	const homePageState: {
		selectedTab: "bounty" | "leaderboard" | "transaction";
	} = $state({
		selectedTab: "bounty",
	});

	setTabState(homePageState);
</script>

<div
	class="mx-auto mt-16 flex w-300 max-w-full gap-3 text-xl
	font-semibold"
>
	<TabButton name="bounty">💰 Bounty</TabButton>
	<TabButton name="leaderboard">📈 Leaderboard</TabButton>
	<TabButton name="transaction">💸 Transaction</TabButton>
</div>

{#if homePageState.selectedTab === "bounty"}
	<BountyList />
{:else}
	<UnderConstruction title="Not available">
		This is an advanced feature meant for beyond hackaton and currently not available in this demo
	</UnderConstruction>
{/if}
