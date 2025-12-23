import { MNEE_API_KEY } from "$env/static/private";
import Mnee from "@mnee/ts-sdk";

export const mnee = new Mnee({
	environment: "sandbox",
	apiKey: MNEE_API_KEY,
});
