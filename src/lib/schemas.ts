import { z } from "zod/v4";
import type { tokens } from "./_eth-shared";

export const bidSchemas = z.object({
	content: z.string().min(5, "Content is too short").max(5000, "Content is too long"),
	files: z.custom<FileList>(),
});

export const bountySchemas = z.object({
	title: z.string().min(5, "Title is too short").max(100, "Title is too long"),
	description: z.string().min(5, "Description is too short").max(1000, "Description is too long"),
	content: z.string().min(5, "Content is too short").max(5000, "Content is too long"),
	deadline: z.number().min(1, "Deadline must be at least 1 day"),
	reward: z.number().gt(0, "Reward must greater than 0"),
	currency: z.custom<keyof typeof tokens.mainnet>(),
});
