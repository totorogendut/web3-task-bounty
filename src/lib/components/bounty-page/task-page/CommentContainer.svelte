<script lang="ts">
	import UserBanner from "$lib/components/UserBanner.svelte";
	import type { CommentType, User } from "$lib/server/db/schemas";
	import type { Snippet } from "svelte";

	interface Props extends CommentType {
		user: Pick<User, "id" | "age" | "avatar" | "username"> | null;
	}

	const { id, user, content }: Props = $props();
</script>

<div class="w-full p-6">
	<UserBanner {...user!} />
	<div>
		{content}
	</div>
</div>
