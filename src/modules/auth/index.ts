import { Elysia, t } from 'elysia';

import { errorPlugin } from '#plugins/error';
import { jwtPlugin } from '#plugins/jwt';
import { oauthPlugin } from '#plugins/oauth';

import { AuthModel } from './model';
import { ResponseAuthModel, type ResponseAuthModelType } from './response.model';
import { handlerLoginAuth, handlerLoginOauth, handlerRegisterAuth } from './service';

export const AuthModules = new Elysia()
	.use(jwtPlugin)
	.use(oauthPlugin)
	.get('/auth/login/google', ({ oauth2 }) => oauth2.redirect('Google', ['profile', 'email']))
	.get(
		'/auth/oauth/google',
		async ({ jwt, oauth2, query, redirect }) => {
			let accessToken: string | null = null;

			try {
				const oauthToken = await oauth2.authorize('Google');
				accessToken = oauthToken.accessToken();
			} catch (error) {
				console.error('auth/oauth/google oauthToken', error);
				return redirect(query.errorRedirectUrl, 307);
			}

			let userInfo: {
				email: string;
				name: string;
			} | null = null;

			try {
				const queryUserInfo = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
					headers: {
						Authorization: 'Bearer ' + accessToken,
					},
				});

				if (!queryUserInfo.ok) {
					console.error('auth/oauth/google queryUserInfo', queryUserInfo);
					return redirect(query.errorRedirectUrl, 307);
				}

				const resultUserInfo = (await queryUserInfo.json()) as object;

				if ('email' in resultUserInfo && typeof resultUserInfo.email === 'string') {
					let userName = resultUserInfo.email.split('@')[0]!;

					if ('name' in resultUserInfo && typeof resultUserInfo.name === 'string') {
						userName = resultUserInfo.name;
					}

					userInfo = {
						email: resultUserInfo.email,
						name: userName,
					};
				}
			} catch (error) {
				console.error('auth/oauth/google resultUserInfo', error);
				return redirect(query.errorRedirectUrl, 307);
			}

			if (!userInfo) {
				console.error('auth/oauth/google userInfo', userInfo);
				return redirect(query.errorRedirectUrl, 307);
			}

			try {
				const result = await handlerLoginOauth(userInfo);

				const token = await jwt.sign({
					userId: result.id,
					exp: '12h',
				});

				const clientUrl = new URL(query.redirectUrl);

				clientUrl.searchParams.set('token', token);
				clientUrl.searchParams.set('role', result.role);

				return redirect(clientUrl.toString(), 307);
			} catch (error) {
				console.error('auth/oauth/google handlerLoginOauth', error);
				return redirect(query.errorRedirectUrl, 307);
			}
		},
		{
			query: AuthModel.oauth,
			response: {
				...errorPlugin.decorator.ctxError.model([400, 401, 500]),
				307: t.String(),
			},
		},
	)
	.post(
		'/auth/login',
		async ({ body, jwt }) => {
			const user = await handlerLoginAuth(body);

			const token = await jwt.sign({
				userId: user.id,
				exp: '12h',
			});

			return Response.json({
				code: 'success',
				message: 'Success login',
				statusCode: 200,
				data: user,
				token,
			} satisfies ResponseAuthModelType['login']);
		},
		{
			body: AuthModel.login,
			response: {
				...errorPlugin.decorator.ctxError.model([400, 401, 403, 404, 500]),
				200: ResponseAuthModel.login,
			},
		},
	)
	.post(
		'/auth/register',
		async ({ body }) => {
			const user = await handlerRegisterAuth(body);

			return Response.json({
				code: 'success',
				message: 'Success register',
				statusCode: 200,
				data: user,
			} satisfies ResponseAuthModelType['register']);
		},
		{
			body: AuthModel.register,
			response: {
				...errorPlugin.decorator.ctxError.model([400, 500]),
				200: ResponseAuthModel.register,
			},
		},
	);
