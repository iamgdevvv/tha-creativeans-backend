import { Elysia } from 'elysia';
import { UnauthorizedException } from 'elysia-http-exception';

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
	.post(
		'/auth/oauth/google',
		async ({ jwt, oauth2 }) => {
			let accessToken: string | null = null;

			try {
				const oauthToken = await oauth2.authorize('Google');
				accessToken = oauthToken.accessToken();
			} catch {
				throw new UnauthorizedException('Invalid access token');
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
			} catch {
				throw new UnauthorizedException('Provided access token is invalid');
			}
			if (!userInfo) {
				throw new UnauthorizedException('User oauth not found');
			}

			const result = await handlerLoginOauth(userInfo);

			const token = await jwt.sign({
				userId: result.id,
				authType: 'auth',
				exp: '12h',
			});

			return Response.json({
				code: 'success',
				message: 'Success login',
				statusCode: 200,
				token,
				data: result,
			} satisfies ResponseAuthModelType['oauth']);
		},
		{
			query: AuthModel.oauth,
			response: {
				...errorPlugin.decorator.ctxError.model([400, 401, 500]),
				200: ResponseAuthModel.oauth,
			},
		},
	)
	.post(
		'/auth/login',
		async ({ body, jwt }) => {
			const user = await handlerLoginAuth(body);

			const token = await jwt.sign({
				userId: user.id,
				authType: 'auth',
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
