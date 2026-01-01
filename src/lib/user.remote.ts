import { getRequestEvent, query } from "$app/server";
import z from "zod/v4";
import { db } from "./server/db";
import { eq } from "drizzle-orm";
import { user as userSchema } from "./server/db/schemas/users";
import { verifyMessage, type Hex, type Signature } from "viem";
import { error, redirect } from "@sveltejs/kit";
import { createJwt } from "./server/jwt";

export const issueNonce = query(z.custom<Hex>().describe("address"), async (address) => {
	const nonce = crypto.randomUUID();

	const existing = await db.query.user.findFirst({
		where: {
			walletAddress: address as Hex,
		},
	});

	if (existing) {
		await db.update(userSchema).set({ nonce }).where(eq(userSchema.walletAddress, address));
	} else {
		await db.insert(userSchema).values({
			walletAddress: address,
			nonce,
		});
	}

	return nonce;
});

export const verifySignedMessage = query(
	z.object({
		address: z.custom<Hex>(),
		signature: z.custom<Hex | Signature>(),
	}),
	async ({ address, signature }) => {
		const user = await db.query.user.findFirst({
			where: {
				walletAddress: address,
			},
		});

		if (!user) throw error(401, "User not found.");

		const message = `Sign this message to login:\nNonce: ${user.nonce}`;
		const isSignatureValid = await verifyMessage({ address, message, signature });

		if (!isSignatureValid) throw error(401, "Invalid signature.");

		// Rotate nonce after login
		await db
			.update(userSchema)
			.set({
				nonce: crypto.randomUUID(),
				lastLoginAt: new Date(),
			})
			.where(eq(userSchema.walletAddress, address));

		const token = await createJwt({
			userId: user.id,
			walletAddress: address,
		});

		getRequestEvent().cookies.set("session", token, {
			path: "/",
			httpOnly: true,
			sameSite: "lax",
			secure: true, // true in production
			maxAge: 60 * 60 * 24 * 7, // 7 days
		});

		return {
			token,
		};
	},
);

export const logout = query(async () => {
	const event = getRequestEvent();
	event.cookies.delete("session", { path: "/" });
	event.locals.user = null;

	redirect(302, "/");
});
