import { query } from "$app/server";
import { db } from "$lib/server/db";
import { user } from "$lib/server/db/schemas/users";
import { getTotalFundBalance } from "$lib/server/mnee/fund";
import { count } from "drizzle-orm";

export const getTotalFund = await query(async () => {
	return getTotalFundBalance();
});

export const getTotalContributors = await query(async () => {
	const [{ total }] = await db.select({ total: count() }).from(user);
	return total;
});

export const getSpentFund = await query(async () => {
	const result = await db.query.bounty.findMany({
		where: { isClaimed: true },
		columns: { reward: true },
	});

	return result.reduce((prev, cur) => {
		prev += cur.reward || 0;
		return prev;
	}, 0);
});
