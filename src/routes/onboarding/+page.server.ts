import { nanoid } from "nanoid";
import type { Actions } from "../$types";
import sharp from "sharp";
import { uploadFiles } from "$lib/server/attachments";
import { db } from "$lib/server/db";
import { user as userSchema } from "$lib/server/db/schemas/users";
import { eq } from "drizzle-orm";
import { redirect } from "@sveltejs/kit";

export const actions: Actions = {
	default: async (event) => {
		const user = event.locals.user;
		const formData = await event.request.formData();
		const username = formData.get("username") as string;

		await db.update(userSchema).set({ username }).where(eq(userSchema.id, user.id));

		// TODO - properly make avatar later on
		// await uploadAvatar(formData.get("avatar") as File, user.id);

		return redirect(303, "/");
	},
};

async function uploadAvatar(file: File, userId: string) {
	const avatarBufferPng = await sharp(await file.arrayBuffer())
		.resize({ width: 64, height: 64 })
		.png()
		.toBuffer();
	const avatarBufferWebp = await sharp(avatarBufferPng).webp({ quality: 80 }).toBuffer();
	const pngBlob = new Blob([Buffer.from(avatarBufferPng)], { type: "image/png" });
	const webpBlob = new Blob([Buffer.from(avatarBufferWebp)], { type: "image/webp" });

	await uploadFiles("avatar", [
		new File([pngBlob], `${userId}.png`, { type: "image/png" }),
		new File([webpBlob], `${userId}.webp`, { type: "image/webp" }),
	]);
}
