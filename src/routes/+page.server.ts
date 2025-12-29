import { getBountyList } from "$lib/components/home-page/index.remote";

/** @type {import('./$types').PageLoad} */
export async function load(event) {
	// Add additional logic here, if needed
	const bountyQ = getBountyList({ offset: 0 });

	const [bountyList] = await Promise.all([bountyQ]);
	return {
		bountyList,
	};
}
