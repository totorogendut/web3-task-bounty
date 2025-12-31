<script lang="ts">
	import HeaderStats from "./HeaderStats.svelte";

	let title = "Web3 Bounty";
</script>

<section class="mx-auto mt-24 flex w-300 max-w-full">
	<div class="">
		<h1 class="text-7xl font-extrabold">{title}</h1>
	</div>

	<div class="relative">
		<img class="rounded-4xl object-cover shadow-xl" src="/hero-image.png" alt={title} />
		<HeaderStats />
	</div>
</section>
