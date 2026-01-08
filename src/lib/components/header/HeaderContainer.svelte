<script lang="ts">
	import { page } from "$app/state";
	import { logout } from "$lib/user.svelte";
	import { wallet } from "$lib/wallet.svelte";
	import { LogIn } from "@lucide/svelte";
	import Avatar from "../user/Avatar.svelte";
	import UserOpts from "./UserOptions.svelte";
</script>

<div class="fixed top-0 z-40 w-full">
	<nav
		class="mx-auto mt-2 flex w-308 max-w-full items-center justify-between
		rounded-md bg-amber-800/50 px-4 py-2 backdrop-blur-md"
	>
		<a href="/" class="font-extrabold">Web3 Bounty </a>
		<div class="group/usernav relative isolate flex items-center gap-3">
			{#if !page.data.user}
				<button
					class="flex cursor-pointer items-center
					gap-2 rounded-sm bg-amber-200 px-4 py-1
					pr-2 font-bold text-amber-900/90 hover:brightness-95"
					onclick={wallet.connect}
				>
					Connect wallet
					<LogIn />
				</button>
			{:else}
				{page.data.user.username}
				<Avatar size={32} user={page.data.user} />
				<UserOpts />
			{/if}
		</div>
	</nav>
</div>
