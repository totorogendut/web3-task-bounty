<script lang="ts">
	import type { Task } from "$lib/server/db/schemas";
	import { getTaskList } from "../home-page/index.remote";

	interface Props {
		list: Task[];
		bountyId: string;
	}

	const { list: taskList }: Props = $props();
	let isLoading = $state(true);
	let offset = $state(0);
	let list = $state(taskList);
	isLoading = false;

	async function fetchMoreList() {
		offset += 10;
		isLoading = true;
		try {
			list.concat(await getTaskList({ bountyId, offset }));
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
