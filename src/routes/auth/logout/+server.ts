import { redirect } from "@sveltejs/kit";
import type { RequestEvent } from "./$types";

export async function GET(event: RequestEvent) {
	event.cookies.delete("session", { path: "/" });
	event.locals.user = null;

	return redirect(302, "/");
}
