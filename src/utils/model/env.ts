import { t } from 'elysia';

const EnvModel = t.Object({
	SERVER_PORT: t.Number(),
	DATABASE_URL: t.String(),
	DIRECT_URL: t.String(),
	JWT_SECRET: t.String(),
	SWAGGER_APIKEY: t.String(),
	BASE_URL: t.String(),
	S3_ENDPOINT: t.String(),
	S3_REGION: t.String(),
	S3_ACCESS_KEY: t.String(),
	S3_SECRET_ACCESS: t.String(),
	GOOGLE_CLIENT_ID: t.String(),
	GOOGLE_CLIENT_SECRET: t.String(),
	GOOGLE_CALLBACK_URL: t.String(),
});

export default EnvModel;
