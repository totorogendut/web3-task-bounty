import { page } from "$app/state";
import Cookies from "js-cookie";

export function logout() {
	// Cookies.remove("session", { path: "/" });
	// page.data.user = null;
	window.location.pathname = "/auth/logout/";
}
