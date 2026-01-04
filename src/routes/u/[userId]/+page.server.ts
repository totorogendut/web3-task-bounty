import { db } from "$lib/server/db";
import { error } from "@sveltejs/kit";
import type { RequestEvent } from "./$types";
import { USER_CLIENT_QUERY_DATA } from "$lib/user.svelte";

export const load = async (event: RequestEvent) => {
	const user = await db.query.user.findFirst({
		where: {
			id: event.params.userId,
		},
		...USER_CLIENT_QUERY_DATA,
	});

	if (!user) throw error(404, "No user found");
	return {
		user,
	};
};
