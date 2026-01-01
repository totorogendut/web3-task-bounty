import { db, keyval } from "$lib/server/db";
import { keyvalSchema } from "$lib/server/db/schemas";
import { redirect } from "@sveltejs/kit";
import { eq } from "drizzle-orm";

/** @type {import('./$types').PageLoad} */
export async function load({ params, url, locals }) {
	// const data = await keyval.get("settings");
	// if (!data && !url.pathname.startsWith("/setup")) {
	// 	return redirect(303, "/setup/");
	// }
	// return {
	// 	settings: data.values as WebAppSettings,
	// };
	return {
		user: locals.user,
	};
}
