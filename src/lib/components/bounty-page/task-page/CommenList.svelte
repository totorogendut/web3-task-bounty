<script lang="ts">
	import type { COMMENTABLE_TYPE } from "$lib/api/_shared";
	import CommentContainer from "./CommentContainer.svelte";
	import { getComments } from "./index.remote";

	interface Props {
		commentableId: string;
		commentableType: (typeof COMMENTABLE_TYPE)[number];
	}

	const { commentableId, commentableType }: Props = $props();

	let offset = $state(0);
	let isFetchMoreDisabled = $state(false);
	let isLoading = $state(true);

	async function fetchMoreComments() {
		offset += 10;
		isLoading = true;
		try {
			comments.concat(await getComments({ offset, commentableId }));
		} catch (error) {
			// TODO - show error message
		} finally {
			isLoading = false;
		}
	}

	let comments = $state(await getComments({ offset: 0, commentableId }));
	isLoading = false;
</script>

<section class="flex grow flex-col gap-2">
	<div class="flex grow flex-col gap-2 bg-amber-200">
		{#each comments as data}
			<CommentContainer {...data} />
		{/each}
	</div>
	<button
		class="mx-auto rounded-md px-2 py-1"
		disabled={isFetchMoreDisabled && !isLoading}
		onclick={fetchMoreComments}
	>
		{isFetchMoreDisabled ? "No more comment..." : "Fetch more"}
	</button>
</section>
