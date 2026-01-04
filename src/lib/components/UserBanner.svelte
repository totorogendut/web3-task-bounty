<script lang="ts">
	import type { User } from "$lib/server/db/schemas";
	import type { UserClient } from "$lib/user.svelte";
	import Avatar from "./user/Avatar.svelte";

	interface Props {
		user: UserClient;
		class?: string;
	}

	const { class: className, user }: Props = $props();
</script>

<a
	href="/u/{user.id}/"
	class={[
		`flex items-center gap-2 rounded-md
	  decoration-2 underline-offset-3
	 hover:underline hover:[&_.avatar-img]:outline-2 hover:[&_.avatar-img]:outline-white`,
		className,
	]}
>
	<Avatar {user} size={36} />
	<strong>{user.username}</strong>
</a>
