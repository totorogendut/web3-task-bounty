import { db } from "$lib/server/db";
import { error } from "@sveltejs/kit";
import type { RequestEvent } from "./$types";
import { USER_CLIENT_QUERY_DATA } from "$lib/user.svelte";
import type { Hex } from "viem";

export const load = async (event: RequestEvent) => {
	const userId = event.params.userId as Hex;
	const user = await db.query.user.findFirst({
		where: {
			id: userId || "0x",
		},
		...USER_CLIENT_QUERY_DATA,
	});

	if (!user) throw error(404, "No user found");
	return {
		user,
	};
};
