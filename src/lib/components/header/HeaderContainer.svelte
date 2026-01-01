<script lang="ts">
	import { wallet } from "$lib/wallet.svelte";
</script>

<div class="fixed top-0 w-full">
	<nav
		class="mx-auto mt-2 flex w-308 max-w-full items-center justify-between
		rounded-md bg-amber-800/50 px-4 py-2"
	>
		<strong
			>Web3 Bounty
			<small class="ml-1 font-semibold opacity-70">
				({wallet.client?.chain?.name})
			</small>
		</strong>
		<div>
			{#if !wallet.address}
				<button
					class="cursor-pointer rounded-sm bg-amber-200 px-4 py-1
					text-black/90 hover:brightness-95"
					onclick={wallet.connect}>Connect wallet</button
				>
			{:else}
				{wallet.address}
			{/if}
		</div>
	</nav>
</div>
