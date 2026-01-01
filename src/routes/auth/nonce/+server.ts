import { db } from "$lib/server/db";
import type { Hex } from "viem";
import type { RequestEvent } from "./$types";
import { eq } from "drizzle-orm";
import { user as userSchema } from "$lib/server/db/schemas/users";

export async function POST(event: RequestEvent) {
	const nonce = crypto.randomUUID();
	const { address }: { address: Hex } = await event.request.json();

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

	return new Response(nonce);
}
