<script lang="ts">
	import { page } from "$app/state";
	import CommentSection from "$lib/components/bid-page/CommentSection.svelte";
	import ProgressList from "$lib/components/bid-page/ProgressList.svelte";

	const { data } = $props();
</script>

<div class="flex min-h-screen w-full p-4">
	<main class="mt-12 grow">
		<strong>{data.state?.replace("_", " ")}</strong>
		<h1>{data.bounty?.title}</h1>
		<h2>{data.title}</h2>
		<div class="">
			{data.content}
		</div>
		<svelte:boundary>
			<ProgressList bidId={page.params.bidId || ""} />
			{#snippet pending()}
				Loading...
			{/snippet}
		</svelte:boundary>
	</main>
	<CommentSection commentableType="bid" commentableId={page.params.bidId || ""} />
</div>
