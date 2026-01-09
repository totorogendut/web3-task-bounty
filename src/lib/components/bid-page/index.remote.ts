import { getRequestEvent, query } from "$app/server";
import { COMMENTABLE_TYPE } from "$lib/api/_shared";
import { db } from "$lib/server/db";
import { USER_CLIENT_QUERY_DATA } from "$lib/user.svelte";
import { comment } from "$lib/server/db/schemas/tasks";
import { error } from "console";
import { eq } from "drizzle-orm";
import z from "zod/v4";
import { fail } from "@sveltejs/kit";
import sanitize from "sanitize-html";
import { marked } from "marked";

export const getBidList = query(
	z.object({
		offset: z.number(),
		limit: z.number().optional(),
		bountyId: z.string().optional(),
		userId: z.string().optional(),
	}),
	async ({ bountyId, userId, offset, limit }) => {
		if (!userId && !bountyId) throw fail(400, "Must provide userId or bountyId");
		const data = await db.query.bid.findMany({
			offset,
			limit: limit || 10,
			orderBy: {
				createdAt: "desc",
			},
			where: userId ? { userId } : { bountyId },
			with: {
				user: USER_CLIENT_QUERY_DATA,
			},
		});

		return Promise.all(
			data.map(async (bid) => {
				bid.content = sanitize(await marked(bid.content));
				return bid;
			}),
		);
	},
);

export const getBountyEscrowData = query(z.object({ id: z.string() }), async ({ id }) => {
	return db.query.bounty.findFirst({
		where: {
			id,
		},
		columns: {
			escrowAddress: true,
		},
	});
});

export const createComment = query(
	z.object({
		commentableType: z.enum(COMMENTABLE_TYPE),
		commentableId: z.string(),
		content: z.string(),
	}),
	async ({ commentableId, commentableType, content }) => {
		const { locals } = getRequestEvent();
		if (!locals.user?.id) throw error(403, "You must login to continue.");

		await db
			.insert(comment)
			.values({ commentableId, userId: locals.user.id, commentableType, content });
		return { success: true };
	},
);

export const editComment = query(
	z.object({
		id: z.string(),
		content: z.string(),
	}),
	async ({ id, content }) => {
		const { locals } = getRequestEvent();
		if (!locals.user?.id) throw error(403, "You must login to continue.");

		await db.update(comment).set({ content }).where(eq(comment.id, id));
		return { success: true };
	},
);

export const getComments = query(
	z.object({
		offset: z.number(),
		limit: z.number().optional(),
		commentableId: z.string(),
	}),
	async ({ offset, limit, commentableId }) => {
		return db.query.comment.findMany({
			offset,
			limit: limit || 10,
			where: {
				commentableId,
			},
			orderBy: {
				createdAt: "desc",
			},
			with: {
				user: USER_CLIENT_QUERY_DATA,
			},
		});
	},
);
