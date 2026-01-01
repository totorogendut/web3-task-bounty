// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
import { MetaMaskInpageProvider } from "@metamask/providers";

declare global {
	namespace App {
		interface Locals {
			user: import("$lib/server/auth.old").SessionValidationResult["user"];
			session: import("$lib/server/auth.old").SessionValidationResult["session"];
		}

		// interface Error {}
		interface Locals {
			user: {
				id: string;
				walletAddress: string;
			} | null;
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}

	interface Window {
		ethereum?: MetaMaskInpageProvider;
	}

	interface WebAppSettings {
		title: string;
		description: string;
	}
}

export {};
