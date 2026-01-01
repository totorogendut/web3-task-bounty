import { db } from "$lib/server/db";
import { verifyJwt } from "$lib/server/jwt";
import type { Handle } from "@sveltejs/kit";

export const handle: Handle = async ({ event, resolve }) => {
	const token = event.cookies.get("session");
	console.log(token);

	if (token) {
		try {
			const payload = await verifyJwt(token);

			event.locals.user = {
				id: payload.userId,
				walletAddress: payload.walletAddress,
			};

			console.log(payload.walletAddress);
		} catch {
			event.cookies.delete("session", { path: "/" });
			event.locals.user = null;
		}
	} else {
		event.locals.user = null;
	}

	return resolve(event);
};
