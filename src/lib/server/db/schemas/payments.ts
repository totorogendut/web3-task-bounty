import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { nanoid } from "nanoid";
import { user } from "./users";
import { BASE_TABLE } from "./_shared";
import { bid } from "./tasks";
import type { Hex } from "viem";

export const transaction = sqliteTable("transaction", {
	...BASE_TABLE,
	userId: text("user_id")
		.notNull()
		.references(() => user.id),
	amount: text("amount").notNull().default("0.00").$type<`${number}.${number}`>(),
	address: text("address").notNull(),
	txHash: text("tx_hash").$type<Hex>(),
	bidId: text("bid_id")
		.notNull()
		.references(() => bid.id),
	bountyId: text("bounty_id")
		.notNull()
		.references(() => bid.id),
	state: text("state").$type<"pending" | "completed" | "rejected">().default("pending"),
	message: text("message"),
	currency: text("currency").default("mnee"),
});
