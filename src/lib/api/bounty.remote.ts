import { getRequestEvent, query } from "$app/server";
import { db } from "$lib/server/db";
import { bounty, comment, task } from "$lib/server/db/schemas/tasks";
import z from "zod/v4";
import { COMMENTABLE_TYPE, TASK_STATE } from "./_shared";
import { and, eq } from "drizzle-orm";
import type { Task } from "$lib/server/db/schemas";
import { error } from "@sveltejs/kit";
import { payApprovedTask } from "$lib/server/payment";

export const createBounty = query(
	z.object({
		projectId: z.string(),
		title: z.string(),
		description: z.string(),
		managersId: z.string().array(),
		reward: z.number(),
	}),
	async ({ projectId, title, description, reward }) => {
		const { locals } = getRequestEvent();
		if (!locals.user?.id) throw error(403, "You must login to continue.");

		return db.insert(bounty).values({ projectId, title, description, reward });
	},
);

export const createTask = query(
	z.object({
		bountyId: z.string(),
		userId: z.string(),
		title: z.string(),
		content: z.string(),
	}),
	async ({ bountyId, userId, title, content }) => {
		const { locals } = getRequestEvent();
		if (!locals.user?.id) throw error(403, "You must login to continue.");

		await db.insert(task).values({ bountyId, userId, title, content });
		return { success: true };
	},
);

export const editTask = query(
	z.object({
		id: z.string(),
		title: z.string().optional(),
		content: z.string().optional(),
	}),
	async ({ id, title, content }) => {
		const data: Partial<Task> = {};
		const { locals } = getRequestEvent();
		if (!locals.user?.id) throw error(403, "You must login to continue.");

		if (title) data.title = title;
		if (content) data.content = content;

		const { changes } = await db
			.update(task)
			.set(data as Task)
			.where(and(eq(task.id, id), eq(task.userId, locals.user.id)));

		if (!changes) error(404, "Edit failed. Item not found.");

		return { success: true };
	},
);
export const submitTask = query(
	z.object({
		id: z.string(),
	}),
	async ({ id }) => {
		const { locals } = getRequestEvent();
		if (!locals.user?.id) throw error(403, "You must login to continue.");

		const { changes } = await db
			.update(task)
			.set({ state: "submitted" })
			.where(and(eq(task.id, id), eq(task.userId, locals.user.id)));

		if (!changes) error(404, "Submit failed. Item not found.");

		return { success: true };
	},
);

export const changeTaskState = query(
	z.object({
		id: z.string(),
		state: z.enum(TASK_STATE),
	}),
	async ({ id, state }) => {
		// check if manager has permision
		const { locals } = getRequestEvent();
		if (!locals.user?.id) throw error(403, "You must login to continue.");

		const { changes } = await db.update(task).set({ state }).where(eq(task.id, id));
		if (!changes) error(404, "Update failed. Item not found.");
		return { success: true };
	},
);

export const approveTask = query(
	z.object({
		id: z.string(),
	}),
	async ({ id }) => {
		// check if manager has permision
		const { locals } = getRequestEvent();
		if (!locals.user?.id) throw error(403, "You must login to continue.");

		const item = await db.query.task.findFirst({
			where: { id },
			with: { bounty: { columns: { managers: true } } },
		});
		if (!item) error(404, "Update failed. Item not found.");
		if (!item.bounty?.managers?.includes?.(locals.user.id))
			throw error(403, "You are not authorized to approve this task.");

		const [result] = await db
			.update(task)
			.set({ state: "approved" })
			.where(eq(task.id, id))
			.returning();
		if (!result) error(404, "Update failed. Item not found.");

		await payApprovedTask(result);

		return { success: true };
	},
);
