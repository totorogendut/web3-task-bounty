<script lang="ts">
	import type { Bid } from "$lib/server/db/schemas";
	import type { UserClient } from "$lib/user.svelte";
	import type { Snippet } from "svelte";
	import UserBanner from "../UserBanner.svelte";

	interface Props extends Bid {
		user: UserClient | null | undefined;
	}

	const { id, content, user }: Props = $props();
</script>

<div class="flex flex-col gap-1">
	<div class="rounded-md bg-amber-200 p-3 text-sm">{content}</div>
	<div class="mt-1 flex items-center gap-2">
		<strong class="mr-2 cowboy-text">Hunter:</strong>
		{#if user}
			<UserBanner class="text-white" {user} />
		{/if}
	</div>
</div>
