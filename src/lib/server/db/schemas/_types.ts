import { createSelectSchema, createInsertSchema } from "drizzle-zod";
import { bounty, comment, progress, task } from "./tasks";

export const bountyInsertSchema = createInsertSchema(bounty, {
	description: (schema) => schema.min(5, "Too short").max(500, "Too long"),
	content: (schema) => schema.min(100, "Too short").max(5000, "Too long"),
});
export const taskInsertSchema = createInsertSchema(task, {
	content: (schema) => schema.min(100, "Too short").max(5000, "Too long"),
});
export const commentInsertSchema = createInsertSchema(comment, {
	content: (schema) => schema.min(1, "Too short").max(5000, "Too long"),
});
export const progressInsertSchema = createInsertSchema(progress, {
	content: (schema) => schema.min(1, "Too short").max(250, "Too long"),
});
