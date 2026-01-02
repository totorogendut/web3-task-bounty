<script lang="ts">
	import { page } from "$app/state";
	import { logout } from "$lib/user.svelte";
	import { wallet } from "$lib/wallet.svelte";
	import Avatar from "../user/Avatar.svelte";
	import UserOpts from "./UserOptions.svelte";
</script>

<div class="fixed top-0 z-40 w-full">
	<nav
		class="mx-auto mt-2 flex w-308 max-w-full items-center justify-between
		rounded-md bg-amber-800/50 px-4 py-2"
	>
		<strong>Web3 Bounty </strong>
		<div class="group/usernav relative isolate flex items-center gap-3">
			{#if !page.data.user}
				<button
					class="cursor-pointer rounded-sm bg-amber-200
					px-4 py-1 text-black/90 hover:brightness-95"
					onclick={wallet.connect}>Connect wallet</button
				>
			{:else}
				{page.data.user.username}
				<Avatar size={32} user={page.data.user} />
				<UserOpts />
			{/if}
		</div>
	</nav>
</div>
