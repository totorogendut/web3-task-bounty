import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { nanoid } from "nanoid";
import { user } from "./users";
import { BASE_TABLE } from "./_shared";
import { task } from "./tasks";

export const pendingPayment = sqliteTable("pending_payment", {
	...BASE_TABLE,
	userId: text("user_id")
		.notNull()
		.references(() => user.id),
	taskId: text("task_id")
		.notNull()
		.references(() => task.id),
	bountyId: text("bounty_id")
		.notNull()
		.references(() => task.id),
	reward: integer("reward").notNull(),
});

export const transaction = sqliteTable("transaction", {
	...BASE_TABLE,
	userId: text("user_id")
		.notNull()
		.references(() => user.id),
	amount: integer("amount").notNull(),
	address: text("address").notNull(),
	ticketId: text("ticket_id"),
	rawtx: text("rawtx"),
	state: text("state").$type<"pending" | "completed" | "rejected">().default("pending"),
	currency: text("currency").default("mnee"),
});
