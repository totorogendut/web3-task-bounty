<script lang="ts">
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
	  text-white/90 decoration-2
	 underline-offset-3 hover:underline`,
		"hover:[&_.avatar-img]:outline-2 hover:[&_.avatar-img]:outline-amber-200",
		"hover:[&_.avatar-img]:text-amber-200!",
		className,
	]}
>
	<Avatar {user} size={36} />
	<strong>{user.username}</strong>
</a>
