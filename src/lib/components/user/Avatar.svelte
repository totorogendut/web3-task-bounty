<script lang="ts">
	import { minidenticon } from "minidenticons";
	import type { UserClient } from "$lib/user.svelte";

	interface Props {
		user: UserClient;
		size?: number;
	}

	const { user, size = 64 }: Props = $props();
</script>

<div
	class="avatar-img overflow-hidden rounded-full bg-amber-300"
	style="width:{size}px; height:{size}px;"
>
	{#if user.avatar}
		<img width={size} height={size} src={user.avatar} alt={user.username} />
	{:else}
		{@html minidenticon(user.id)}
	{/if}
</div>
