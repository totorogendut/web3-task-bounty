import { query } from "$app/server";
import { db } from "$lib/server/db";
import { user } from "$lib/server/db/schemas/users";
import { getTotalFundBalance } from "$lib/server/mnee/fund";
import { count } from "drizzle-orm";
import z from "zod/v4";

export const getTotalFund = query(async () => {
	return 15;
	// return getTotalFundBalance();
});

export const getTotalContributors = query(async () => {
	const [{ total }] = await db.select({ total: count() }).from(user);
	return total;
});

export const getSpentFund = query(async () => {
	const result = await db.query.bounty.findMany({
		where: { isClaimed: true },
		columns: { reward: true },
	});

	return result.reduce((prev, cur) => {
		prev += cur.reward || 0;
		return prev;
	}, 0);
});

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
		});
	},
);
