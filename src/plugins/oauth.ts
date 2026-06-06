import { oauth2 } from 'elysia-oauth2';

export function oauthPlugin() {
	return oauth2({
		Google: [
			process.env.GOOGLE_CLIENT_ID,
			process.env.GOOGLE_CLIENT_SECRET,
			process.env.GOOGLE_CALLBACK_URL,
		],
	});
}
