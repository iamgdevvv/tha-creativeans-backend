declare module 'bun' {
	interface Env {
		SERVER_PORT: number;
		DATABASE_URL: string;
		DIRECT_URL: string;
		JWT_SECRET: string;
		SWAGGER_APIKEY: string;
		BASE_URL: string;
		S3_ENDPOINT: string;
		S3_REGION: string;
		S3_ACCESS_KEY: string;
		S3_SECRET_ACCESS: string;
		GOOGLE_CLIENT_ID: string;
		GOOGLE_CLIENT_SECRET: string;
		GOOGLE_CALLBACK_URL: string;
	}
}
