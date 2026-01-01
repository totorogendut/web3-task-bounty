<script lang="ts">
	import "./layout.css";
	import favicon from "$lib/assets/favicon.svg";
	import HeaderContainer from "$lib/components/header/HeaderContainer.svelte";

	let { children, data } = $props();
</script>

<svelte:head
	><link rel="icon" href={favicon} />
	<title>Web3 Bounty</title>
</svelte:head>

<HeaderContainer />
{@render children()}
