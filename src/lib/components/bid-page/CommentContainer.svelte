<script lang="ts">
	import type { CommentType } from "$lib/server/db/schemas";
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
