<script lang="ts">
	import { getBountyList } from "./index.remote";

	let isLoading = $state(true);
	let offset = $state(0);
	let list = $state(await getBountyList({ offset: 0 }));
	isLoading = false;

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
