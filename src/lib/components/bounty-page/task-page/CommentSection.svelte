<script lang="ts">
	import type { COMMENTABLE_TYPE } from "$lib/api/_shared";
	import UserBanner from "$lib/components/UserBanner.svelte";
	import { getComments } from "./index.remote";

	interface Props {
		commentableId: string;
		commentableType: (typeof COMMENTABLE_TYPE)[number];
	}

	const { commentableId, commentableType }: Props = $props();

	let offset = $state(0);
	let isFetchMoreDisabled = $state(false);
	let comments = $state(await getComments({ offset: 0, commentableId }));

	async function fetchMoreComments() {
		offset += 10;
		comments.concat(await getComments({ offset, commentableId }));
	}
</script>

<section>
	{#each comments as { content, user }}
		<div>
			<UserBanner {...user!} />
			<div>
				{content}
			</div>
		</div>
	{/each}
</section>
<button class="rounded-md px-2 py-1" disabled={isFetchMoreDisabled} onclick={fetchMoreComments}>
	Fetch more
</button>
