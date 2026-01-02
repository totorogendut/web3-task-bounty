import { db, keyval } from "$lib/server/db";
import { keyvalSchema } from "$lib/server/db/schemas";
import { USER_CLIENT_QUERY_DATA } from "$lib/server/db/schemas/_shared.js";
import { redirect } from "@sveltejs/kit";
import { eq } from "drizzle-orm";

/** @type {import('./$types').PageLoad} */
export async function load({ params, url, locals }) {
	const user = await db.query.user.findFirst({
		where: {
			id: locals.user?.id || "",
		},
		...USER_CLIENT_QUERY_DATA,
	});

	if (locals.user && user && !user?.username && !url.pathname.startsWith("/onboarding")) {
		redirect(303, "/onboarding/");
	}

	return {
		user,
	};
}
