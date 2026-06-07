import { Elysia, t } from 'elysia';

import { handlerJwtAuth } from '#modules/auth/service';
import { errorPlugin } from '#plugins/error';
import { jwtPlugin } from '#plugins/jwt';

import { AssetModel } from './model';
import { ResponseAssetModel, type ResponseAssetModelType } from './response.model';
import { handerAsset, handlerAssets, handlerDeleteAsset, handlerUploadAsset } from './service';

export const AssetModules = new Elysia()
	.use(jwtPlugin)
	.get(
		'/assets/:path/:filename',
		async ({ params, set, redirect }) => {
			const file = await handerAsset(params);

			set.headers['cache-control'] = 'public, max-age=31536000, immutable';
			set.headers['Content-Type'] = file.type || 'application/octet-stream';

			return redirect(
				file.presign({
					expiresIn: 31536000,
				}),
				301,
			);
		},
		{
			params: AssetModel.params,
			response: {
				...errorPlugin.decorator.ctxError.model(),
				301: t.File(),
			},
			detail: {
				security: [
					{
						bearerAuth: [],
					},
				],
			},
		},
	)
	.post(
		'/assets',
		async ({ headers, jwt, body }) => {
			const authUser = await handlerJwtAuth(jwt.verify, {
				bearerToken: headers.authorization,
				role: ['ADMIN', 'STAFF'],
			});

			const result = await handlerUploadAsset({
				...body,
				userId: authUser.userId,
			});

			return Response.json({
				code: 'success',
				message: 'Success retrieve data',
				statusCode: 200,
				data: result,
			} satisfies ResponseAssetModelType['upload']);
		},
		{
			body: AssetModel.upload,
			response: {
				...errorPlugin.decorator.ctxError.model(),
				200: ResponseAssetModel.assets,
			},
		},
	)
	.get(
		'/assets',
		async ({ headers, jwt, query }) => {
			const authUser = await handlerJwtAuth(jwt.verify, {
				bearerToken: headers.authorization,
				role: ['ADMIN', 'STAFF'],
			});

			const result = await handlerAssets({
				...query,
				authId: authUser.userId,
				authRole: authUser.role,
			});

			return Response.json({
				code: 'success',
				message: 'Success retrieve data',
				statusCode: 200,
				data: result.data,
				total: result.total,
				skip: query.skip || 0,
				limit: query.limit || 10,
			} satisfies ResponseAssetModelType['assets']);
		},
		{
			query: AssetModel.queries,
			response: {
				...errorPlugin.decorator.ctxError.model(),
				200: ResponseAssetModel.assets,
			},
			detail: {
				security: [
					{
						bearerAuth: [],
					},
				],
			},
		},
	)
	.delete(
		'/assets/:path/:filename',
		async ({ jwt, headers, params }) => {
			await handlerJwtAuth(jwt.verify, {
				bearerToken: headers.authorization,
				role: ['ADMIN', 'STAFF'],
			});

			await handlerDeleteAsset(params);

			return Response.json({
				code: 'success',
				message: 'Success delete data',
				statusCode: 200,
			} satisfies ResponseAssetModelType['delete']);
		},
		{
			params: AssetModel.params,
			response: {
				...errorPlugin.decorator.ctxError.model(),
				200: ResponseAssetModel.delete,
			},
			detail: {
				security: [
					{
						bearerAuth: [],
					},
				],
			},
		},
	);
