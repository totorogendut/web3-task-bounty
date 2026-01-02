<script lang="ts">
	import "./layout.css";
	import favicon from "$lib/assets/favicon.svg";
	import HeaderContainer from "$lib/components/header/HeaderContainer.svelte";
	import { wallet } from "$lib/wallet.svelte.js";

	let { children, data } = $props();
</script>

<svelte:head
	><link rel="icon" href={favicon} />
	<title>Web3 Bounty</title>
</svelte:head>

<HeaderContainer />
<div class="flex min-h-screen flex-col">
	<main class="grow">
		{@render children()}
	</main>

	<footer
		class="mt-12 flex h-12 items-center justify-center
		text-sm font-bold"
	>
		Made by TotoroGendut for MNEE Hackaton
	</footer>
</div>
