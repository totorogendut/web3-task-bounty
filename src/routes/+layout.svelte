<script lang="ts">
	import "./styles/app.css";
	import favicon from "$lib/assets/favicon.svg";
	import HeaderContainer from "$lib/components/header/HeaderContainer.svelte";

	let { children, data } = $props();
	const fonts = "Rye";
</script>

<svelte:head
	><link rel="icon" href={favicon} />
	<title>Web3 Bounty</title>
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="" />
	<link href="https://fonts.googleapis.com/css2?family={fonts}&display=swap" rel="stylesheet" />
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
