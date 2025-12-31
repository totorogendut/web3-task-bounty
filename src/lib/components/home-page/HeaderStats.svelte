<script lang="ts">
	import { getSpentFund, getTotalContributors, getTotalFund } from "./index.remote";
</script>

<div
	class="absolute right-4 -bottom-40 mt-8 flex w-80 flex-col
		gap-4 rounded-2xl bg-red-200 p-4 text-4xl text-red-800
		shadow-2xl ring-4 ring-red-700"
>
	<div class="flex flex-col gap-2">
		<small>Total fund</small>
		<svelte:boundary>
			<strong>{await getTotalFund()} MNEE</strong>
			{#snippet pending()}...{/snippet}
		</svelte:boundary>
	</div>
	<div class="flex flex-col gap-1">
		<small>Spent fund</small>
		<svelte:boundary>
			<strong>{await getSpentFund()}</strong>
			{#snippet pending()}...{/snippet}
		</svelte:boundary>
	</div>
	<div class="flex flex-col gap-2">
		<small>Total contributors</small>
		<svelte:boundary>
			<strong>{await getTotalContributors()}</strong>
			{#snippet pending()}...{/snippet}
		</svelte:boundary>
	</div>
</div>
