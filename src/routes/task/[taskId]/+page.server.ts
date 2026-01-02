import { db } from "$lib/server/db/index.js";
import type { Actions } from "@sveltejs/kit";
import { error } from "@sveltejs/kit";

export const load = async ({ params, url }) => {
	const task = await db.query.task.findFirst({
		where: {
			id: params.taskId,
		},
		with: {
			bounty: true,
		},
	});

	if (!task) throw error(404, "Task not found.");

	return {
		...task,
	};
};

export const actions: Actions = {
	default: async (event) => {},
};
