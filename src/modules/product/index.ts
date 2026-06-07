import { Elysia, t } from 'elysia';

import { handlerJwtAuth } from '#modules/auth/service';
import { errorPlugin } from '#plugins/error';
import { jwtPlugin } from '#plugins/jwt';

import { ProductModel } from './model';
import { ResponseProductModel, type ResponseProductModelType } from './response.model';
import {
	handlerCreateProduct,
	handlerDeleteProduct,
	handlerProduct,
	handlerProductPublic,
	handlerProducts,
	handlerProductsPublic,
	handlerUpdateProduct,
} from './service';

export const ProductModules = new Elysia()
	.use(jwtPlugin)
	.get(
		'/products/public',
		async ({ query }) => {
			const result = await handlerProductsPublic(query);

			return Response.json({
				code: 'success',
				message: 'Success retrieve data',
				statusCode: 200,
				data: result.data,
				total: result.total,
				skip: query.skip || 0,
				limit: query.limit || 10,
			} satisfies ResponseProductModelType['productsPublic']);
		},
		{
			query: ProductModel.queriesPublic,
			response: {
				...errorPlugin.decorator.ctxError.model(),
				200: ResponseProductModel.productsPublic,
			},
		},
	)
	.get(
		'/products/public/:slug',
		async ({ jwt, headers, params }) => {
			await handlerJwtAuth(jwt.verify, {
				bearerToken: headers.authorization,
			});

			const product = await handlerProductPublic(params.slug);

			return Response.json({
				code: 'success',
				message: 'Success retrieve data',
				statusCode: 200,
				data: product,
			} satisfies ResponseProductModelType['productPublic']);
		},
		{
			params: t.Pick(ProductModel.params, ['slug']),
			response: {
				...errorPlugin.decorator.ctxError.model(),
				200: ResponseProductModel.productPublic,
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
	.get(
		'/products',
		async ({ headers, jwt, query }) => {
			const authUser = await handlerJwtAuth(jwt.verify, {
				bearerToken: headers.authorization,
				role: ['ADMIN', 'STAFF'],
			});

			const result = await handlerProducts({
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
			} satisfies ResponseProductModelType['products']);
		},
		{
			query: ProductModel.queries,
			response: {
				...errorPlugin.decorator.ctxError.model(),
				200: ResponseProductModel.products,
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
		'/products',
		async ({ jwt, headers, body }) => {
			const authUser = await handlerJwtAuth(jwt.verify, {
				bearerToken: headers.authorization,
				role: ['ADMIN', 'STAFF'],
			});

			const result = await handlerCreateProduct({
				...body,
				userId: authUser.userId,
			});

			return Response.json(
				{
					code: 'success',
					message: 'Success create data',
					statusCode: 201,
					data: result,
				} satisfies ResponseProductModelType['product'],
				{
					status: 201,
				},
			);
		},
		{
			body: ProductModel.create,
			response: {
				...errorPlugin.decorator.ctxError.model(),
				201: ResponseProductModel.product,
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
	.get(
		'/products/:id',
		async ({ jwt, headers, query, params }) => {
			await handlerJwtAuth(jwt.verify, {
				bearerToken: headers.authorization,
				role: ['ADMIN'],
				productId: params.id,
			});

			const product = await handlerProduct(params.id, query);

			return Response.json({
				code: 'success',
				message: 'Success retrieve data',
				statusCode: 200,
				data: product,
			} satisfies ResponseProductModelType['product']);
		},
		{
			params: t.Pick(ProductModel.params, ['id']),
			query: ProductModel.query,
			response: {
				...errorPlugin.decorator.ctxError.model(),
				200: ResponseProductModel.product,
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
	.patch(
		'/products/:id',
		async ({ jwt, headers, body, params }) => {
			await handlerJwtAuth(jwt.verify, {
				bearerToken: headers.authorization,
				role: ['ADMIN'],
				productId: params.id,
			});

			const product = await handlerUpdateProduct(params.id, body);

			return Response.json({
				code: 'success',
				message: 'Success update data',
				statusCode: 200,
				data: product,
			} satisfies ResponseProductModelType['product']);
		},
		{
			params: t.Pick(ProductModel.params, ['id']),
			body: ProductModel.update,
			response: {
				...errorPlugin.decorator.ctxError.model(),
				200: ResponseProductModel.product,
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
		'/products/:id',
		async ({ jwt, headers, params }) => {
			await handlerJwtAuth(jwt.verify, {
				bearerToken: headers.authorization,
				role: ['ADMIN'],
				productId: params.id,
			});

			await handlerDeleteProduct(params.id);

			return Response.json({
				code: 'success',
				message: 'Success delete data',
				statusCode: 200,
			} satisfies ResponseProductModelType['delete']);
		},
		{
			params: t.Pick(ProductModel.params, ['id']),
			response: {
				...errorPlugin.decorator.ctxError.model(),
				200: ResponseProductModel.delete,
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
