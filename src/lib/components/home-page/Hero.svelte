<script lang="ts">
	import Stats from "./Stats.svelte";

	let title = "Web3 Bounty";
</script>

<section class="mx-auto mt-24 flex w-300 max-w-full">
	<div class="relative">
		<img class="absolute -bottom-14 left-4 -z-10 rotate-14" src="/arrow.webp" alt="Arrow." />
		<h1 class="text-7xl font-extrabold">{title}</h1>
		<strong class="absolute mt-4 pr-2 leading-[1.2] font-semibold opacity-80"
			>Post a work as bounty. Or earn as a freelancer by completing a bounty. Where bounty bound by
			a smart contract.
		</strong>
	</div>

	<div class="relative">
		<img class="rounded-4xl object-cover shadow-xl" src="/hero-image.png" alt={title} />
		<Stats />
	</div>
</section>
