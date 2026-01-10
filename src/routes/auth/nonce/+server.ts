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
			id: (address as Hex) || "0x",
		},
	});

	if (existing) {
		await db.update(userSchema).set({ nonce }).where(eq(userSchema.id, address));
	} else {
		await db.insert(userSchema).values({
			id: address,
			nonce,
		});
	}

	return new Response(nonce);
}
