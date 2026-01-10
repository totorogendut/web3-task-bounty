import type { Actions } from "../$types";
// import sharp from "sharp";
// import { uploadFiles } from "$lib/server/attachments";
import { db } from "$lib/server/db";
import { user as userSchema } from "$lib/server/db/schemas/users";
import { eq } from "drizzle-orm";
import { error, redirect } from "@sveltejs/kit";

export const actions: Actions = {
	default: async (event) => {
		const user = event.locals.user;
		if (!user) throw error(403, "No user found");
		const formData = await event.request.formData();
		const username = formData.get("username") as string;

		await db.update(userSchema).set({ username }).where(eq(userSchema.id, user.id));

		// TODO - properly make avatar later on
		// await uploadAvatar(formData.get("avatar") as File, user.id);

		return redirect(302, "/");
	},
};
