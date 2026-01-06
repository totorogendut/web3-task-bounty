import {
	S3_ACCESS_KEY_ID,
	S3_BUCKET,
	S3_ENDPOINT,
	S3_REGION,
	S3_SECRET_ACCESS_KEY,
} from "$env/static/private";
import { error } from "@sveltejs/kit";
import pLimit from "p-limit";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const s3Client = new S3Client({
	region: S3_REGION,
	credentials: {
		accessKeyId: S3_ACCESS_KEY_ID,
		secretAccessKey: S3_SECRET_ACCESS_KEY,
	},
	requestStreamBufferSize: 32 * 1024,
	endpoint: S3_ENDPOINT,
});

const uploadLimit = pLimit(5);

export async function uploadFiles(prefix: string, files: File[]) {
	try {
		const q = files.map(async (file) =>
			uploadLimit(async () => {
				const fileName = `${prefix}/${file.name}`;
				console.log("Uploadng", fileName);

				await s3Client.send(
					new PutObjectCommand({
						Bucket: S3_BUCKET,
						Key: fileName,
						Body: new Uint8Array(await file.arrayBuffer()),
						ContentType: file.type,
					}),
				);

				return fileName;
			}),
		);

		return await Promise.all(q);
	} catch (err) {
		console.log(err);
		throw error(500, "Error uploading files to s3.");
	}
}
