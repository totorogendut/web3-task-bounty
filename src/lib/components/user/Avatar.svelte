<script lang="ts">
	import type { User } from "$lib/server/db/schemas";
	import type { Snippet } from "svelte";
	import { minidenticon } from "minidenticons";

	interface Props {
		user: Pick<User, "id" | "avatar" | "username" | "walletAddress">;
		size?: number;
	}

	const { user, size = 64 }: Props = $props();
</script>

<div class="overflow-hidden rounded-full bg-amber-300" style="width:{size}px; height:{size}px;">
	{#if user.avatar}
		<img width={size} height={size} src={user.avatar} alt={user.username} />
	{:else}
		{@html minidenticon(user.id)}
	{/if}
</div>
