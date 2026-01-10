import { page } from "$app/state";
import type { User } from "./server/db/schemas";

export type UserClient = Pick<User, "id" | "avatar" | "username">;
export const USER_CLIENT_QUERY_DATA = {
	columns: {
		avatar: true,
		username: true,
		id: true,
		skills: true,
	},
} as const;

export function isLocalUser(userId: string | undefined | null) {
	return !!userId && page.data?.user?.id === userId;
}

export function logout() {
	// Cookies.remove("session", { path: "/" });
	// page.data.user = null;
	window.location.pathname = "/auth/logout/";
}
