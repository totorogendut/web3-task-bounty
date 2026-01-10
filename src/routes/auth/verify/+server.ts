import { db } from "$lib/server/db";
import { verifyMessage, type Hex } from "viem";
import type { RequestEvent } from "./$types";
import { eq } from "drizzle-orm";
import { user as userSchema } from "$lib/server/db/schemas/users";
import { error } from "@sveltejs/kit";
import { createJwt } from "$lib/server/jwt";

export async function POST(event: RequestEvent) {
	const { address, signature }: { address: Hex; signature: Hex } = await event.request.json();
	const user = await db.query.user.findFirst({
		where: {
			id: address || "0x",
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
		.where(eq(userSchema.id, address));

	const token = await createJwt({
		userId: address,
	});

	event.cookies.set("session", token, {
		path: "/",
		httpOnly: true,
		sameSite: "lax",
		secure: true, // true in production
		maxAge: 60 * 60 * 24 * 7, // 7 days
	});

	return new Response(token);
}
