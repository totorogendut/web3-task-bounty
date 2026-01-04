<script lang="ts">
	import UserBanner from "$lib/components/UserBanner.svelte";
	import type { CommentType, User } from "$lib/server/db/schemas";
	import type { Snippet } from "svelte";
	import Avatar from "../user/Avatar.svelte";
	import type { UserClient } from "$lib/user.svelte";

	interface Props extends CommentType {
		user: UserClient;
	}

	const { id, user, content }: Props = $props();
</script>

<div class="w-full p-6">
	<Avatar {user} />
	<div>
		{content}
	</div>
</div>
