<script lang="ts">
	import { getSpentFund, getTotalContributors, getTotalFund } from "./index.remote";
	import HeaderHero from "./HeaderHero.svelte";
</script>

<HeaderHero />
<section class="mx-auto mt-8 flex w-250 max-w-full items-center justify-between text-5xl">
	<svelte:boundary>
		<div class="flex flex-col gap-2">
			<strong>{await getTotalFund()} MNEE</strong>
			<small>Total fund</small>
		</div>
		{#snippet pending()}{/snippet}
		{#snippet failed(err, reset)}{/snippet}
	</svelte:boundary>
	<svelte:boundary>
		<div class="flex flex-col gap-2">
			<strong>{await getSpentFund()}</strong>
			<small>Spent fund</small>
		</div>
		<div class="flex flex-col gap-2">
			<strong>{await getTotalContributors()}</strong>
			<small>Total contributors</small>
		</div>
		{#snippet pending()}{/snippet}
		{#snippet failed(err, reset)}{/snippet}
	</svelte:boundary>
</section>
