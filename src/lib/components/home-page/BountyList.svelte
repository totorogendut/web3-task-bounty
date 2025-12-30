<script lang="ts">
	import type { Bounty } from "$lib/server/db/schemas";
	import { getBountyList } from "./index.remote";

	interface Props {
		list: Bounty[];
	}

	const { list: bountyList }: Props = $props();
	let isLoading = $state(false);
	let offset = $state(0);
	let list = $state(bountyList);

	async function fetchMoreList() {
		offset += 10;
		isLoading = true;
		try {
			list.concat(await getBountyList({ offset }));
		} catch (error) {
		} finally {
			isLoading = false;
		}
	}
</script>

<section>
	{#each list as { title, description }}
		<div>
			<strong>{title}</strong>
			<span>{description}</span>
		</div>
	{/each}
</section>
<button onclick={fetchMoreList}>More</button>
