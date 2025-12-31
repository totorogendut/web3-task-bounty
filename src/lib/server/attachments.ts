import { error } from "@sveltejs/kit";
import { s3 } from "bun";

export async function uploadFiles(prefix: string, files: File[]) {
	const q = files.map(async (file) => {
		const s3file = s3.file(`${prefix}/${file.name}`);
		await s3file.write(await file.arrayBuffer());

		return s3file;
	});

	try {
		return await Promise.all(q);
	} catch (err) {
		throw error(500, "Error uploading files to s3.");
	}
}
