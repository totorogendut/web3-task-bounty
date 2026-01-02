<script lang="ts">
	import type { COMMENTABLE_TYPE } from "$lib/api/_shared";
	import CommenList from "./CommenList.svelte";
	import CommentForm from "./CommentForm.svelte";
	import { getComments } from "./index.remote";

	interface Props {
		commentableId: string;
		commentableType: (typeof COMMENTABLE_TYPE)[number];
	}

	const { commentableId, commentableType }: Props = $props();
</script>

<section class="sticky top-0 flex w-1/3 flex-col gap-2 pt-14">
	<svelte:boundary>
		{#snippet pending()}
			<div class="grow">Loading...</div>
		{/snippet}
		<CommenList {commentableId} {commentableType} />
	</svelte:boundary>
	<CommentForm />
</section>
