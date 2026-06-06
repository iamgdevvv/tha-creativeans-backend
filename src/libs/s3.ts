export const s3 = new Bun.S3Client({
	accessKeyId: process.env.S3_ACCESS_KEY,
	secretAccessKey: process.env.S3_SECRET_ACCESS,
	endpoint: process.env.S3_ENDPOINT,
	region: process.env.S3_REGION,
});
