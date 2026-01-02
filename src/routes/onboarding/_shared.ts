import z from "zod/v4";

export const usernameSchema = z
	.string()
	.min(3, "Username too short")
	.max(16, "Username too long")
	.regex(/^[A-Za-z0-9_-]+$/, "Only digits, letters, underscore (_) and dash (-) are allowed");
