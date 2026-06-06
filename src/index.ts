import { cors } from '@elysia/cors';
import { serverTiming } from '@elysia/server-timing';
import { openapi } from '@elysiajs/openapi';
import { elysiaLogger } from '@logtape/elysia';
import { Elysia, redirect } from 'elysia';
import { httpExceptionPlugin, UnauthorizedException } from 'elysia-http-exception';
// import { dts } from 'elysia-remote-dts';

import { AssetModules } from '#modules/asset';
import { AuthModules } from '#modules/auth';
import { CategoryModules } from '#modules/category';
import { ProductModules } from '#modules/product';
import { UserModules } from '#modules/user';
import { errorPlugin } from '#plugins/error';
import { initLogger } from '#plugins/logger';
import EnvModel from '#utils/model/env';

initLogger();

const app = new Elysia()
	.use(elysiaLogger())
	.use(errorPlugin)
	.onError(({ ctxError, ...error }) => {
		return ctxError.response(error);
	})
	.env(EnvModel)
	.use(serverTiming())
	.use(
		cors({
			origin: true,
			methods: ['GET', 'POST', 'PUT', 'DELETE'],
			credentials: true,
		}),
	)
	.use(httpExceptionPlugin())
	.onBeforeHandle(({ request }) => {
		const url = new URL(request.url);

		// Redirect trailing slash
		if (url.pathname !== '/' && url.pathname.endsWith('/')) {
			return redirect(url.pathname.slice(0, -1) + url.search, 302);
		}

		if (url.pathname === '/openapi') {
			const apiKey = url.searchParams.get('apiKey');

			if (!apiKey) {
				throw new UnauthorizedException('Missing api key');
			}

			if (apiKey !== process.env.SWAGGER_APIKEY) {
				throw new UnauthorizedException('Invalid api key');
			}
		}
	})
	// .use(dts('./src/index.ts'))
	.group('/api', (server) =>
		server
			.use(AuthModules)
			.use(UserModules)
			.use(ProductModules)
			.use(CategoryModules)
			.use(AssetModules),
	)
	.get('/favicon.ico', () => new Response(null, { status: 204 }))
	.get('/.well-known*', () => new Response(null, { status: 204 }))
	.get('/healthcheck', () => Response.json({ status: 'ok' }))
	.use(
		openapi({
			exclude: {
				staticFile: false,
			},
			documentation: {
				info: {
					title: 'THA Product Search API',
					version: '1.0.0',
				},
				components: {
					securitySchemes: {
						bearerAuth: {
							type: 'http',
							scheme: 'bearer',
							bearerFormat: 'JWT',
						},
					},
				},
			},
		}),
	)
	.listen(process.env.SERVER_PORT);

console.log(`🦊 Elysia running at ${app.server?.hostname}:${app.server?.port}`);

export type App = typeof app;
