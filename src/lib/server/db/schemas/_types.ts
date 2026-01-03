import { createSelectSchema, createInsertSchema } from "drizzle-zod";
import { bounty, comment, progress, task } from "./tasks";

export const bountyInsertSchema = createInsertSchema(bounty, {
	description: (schema) =>
		schema.min(5, "Description is too short").max(500, "Description is too long"),
	content: (schema) => schema.min(100, "Content is too short").max(5000, "Content is too long"),
});
export const taskInsertSchema = createInsertSchema(task, {
	content: (schema) => schema.min(100, "Content is too short").max(5000, "Content is too long"),
});
export const commentInsertSchema = createInsertSchema(comment, {
	content: (schema) => schema.min(1, "Content is too short").max(5000, "Content is too long"),
});
export const progressInsertSchema = createInsertSchema(progress, {
	content: (schema) => schema.min(1, "Content is too short").max(250, "Content is too long"),
});
