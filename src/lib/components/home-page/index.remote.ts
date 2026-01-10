import { query } from "$app/server";
import { db } from "$lib/server/db";
import z from "zod/v4";

export const getBountyList = query(
	z.object({
		limit: z.number().optional(),
		offset: z.number(),
	}),
	async ({ offset, limit }) => {
		return db.query.bounty.findMany({
			offset,
			limit: limit || 10,
			orderBy: {
				createdAt: "desc",
			},
			where: {
				escrowStatus: "bid open",
			},
		});
	},
);
