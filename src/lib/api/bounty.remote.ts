import { query } from "$app/server";
import z from "zod/v4";

export const uploadTask = query(async () => {});
export const createBounty = query(
	z.object({
		title: z.string(),
		description: z.string(),
		managersId: z.string().array(),
	}),
	async (data) => {},
);
export const createTask = query(
	z.object({
		bountyId: z.string(),
		userId: z.string(),
		title: z.string(),
		description: z.string(),
	}),
	async (data) => {},
);
