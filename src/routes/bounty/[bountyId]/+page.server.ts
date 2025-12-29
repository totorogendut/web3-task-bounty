import { getTaskList } from "$lib/components/home-page/index.remote.js";

/** @type {import('./$types').PageLoad} */
export async function load({ params }) {
	// Add additional logic here, if needed
	const taskQ = getTaskList({ offset: 0, bountyId: params.bountyId });

	const [taskList] = await Promise.all([taskQ]);
	return {
		taskList,
	};
}
