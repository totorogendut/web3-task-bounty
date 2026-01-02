import { S3_ACCESS_KEY_ID, S3_BUCKET, S3_REGION, S3_SECRET_ACCESS_KEY } from "$env/static/private";
import { error } from "@sveltejs/kit";
import pLimit from "p-limit";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const s3Client = new S3Client({
	region: S3_REGION,
	credentials: {
		accessKeyId: S3_ACCESS_KEY_ID,
		secretAccessKey: S3_SECRET_ACCESS_KEY,
	},
});

const uploadLimit = pLimit(5);

export async function uploadFiles(prefix: string, files: File[]) {
	try {
		const q = files.map(async (file) =>
			uploadLimit(async () => {
				const fileName = `${prefix}/${file.name}`;

				await s3Client.send(
					new PutObjectCommand({
						Bucket: S3_BUCKET,
						Key: fileName,
						Body: file,
						ContentType: file.type,
					}),
				);

				return fileName;
			}),
		);

		return await Promise.all(q);
	} catch (err) {
		throw error(500, "Error uploading files to s3.");
	}
}
