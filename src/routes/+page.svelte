<script lang="ts">
	import BountyList from "$lib/components/home-page/BountyList.svelte";
	import HeaderSection from "$lib/components/home-page/HeaderSection.svelte";
	import { setContext } from "svelte";

	const { data } = $props();
</script>

<HeaderSection />

<style>
	:global(body) {
		background-color: var(--color-violet-400);
		color: var(--color-violet-50);
	}
</style>
