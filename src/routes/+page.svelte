<script lang="ts">
	import BountyList from "$lib/components/home-page/BountyList.svelte";
	import MainSection from "$lib/components/home-page/MainSection.svelte";
	import { setContext } from "svelte";

	const { data } = $props();
</script>

<MainSection />

<style>
	:global(body) {
		background-color: var(--color-violet-400);
		color: var(--color-violet-50);
	}
</style>
