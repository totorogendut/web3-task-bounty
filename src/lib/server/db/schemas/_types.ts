import { createSelectSchema, createInsertSchema } from "drizzle-zod";
import { bounty, comment, progress, bid } from "./tasks";

export const bountyInsertSchema = createInsertSchema(bounty, {
	title: (schema) => schema.min(3, "Description is too short").max(100, "Description is too long"),
	description: (schema) =>
		schema.min(3, "Description is too short").max(500, "Description is too long"),
	content: (schema) => schema.min(3, "Content is too short").max(5000, "Content is too long"),
});
export const bidInsertSchema = createInsertSchema(bid, {
	content: (schema) => schema.min(3, "Content is too short").max(5000, "Content is too long"),
	submission: (schema) =>
		schema.regex(
			/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
			"Submission must be an URL",
		),
});
export const commentInsertSchema = createInsertSchema(comment, {
	content: (schema) => schema.min(1, "Content is too short").max(5000, "Content is too long"),
});
export const progressInsertSchema = createInsertSchema(progress, {
	content: (schema) => schema.min(1, "Content is too short").max(250, "Content is too long"),
});
