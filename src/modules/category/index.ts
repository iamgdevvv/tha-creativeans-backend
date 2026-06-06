import { Elysia, t } from 'elysia';

import { handlerJwtAuth } from '#modules/auth/service';
import { errorPlugin } from '#plugins/error';
import { jwtPlugin } from '#plugins/jwt';

import { CategoryModel } from './model';
import { ResponseCategoryModel, type ResponseCategoryModelType } from './response.model';
import {
	handlerCategories,
	handlerCategory,
	handlerCreateCategory,
	handlerDeleteCategory,
	handlerUpdateCategory,
} from './service';

export const CategoryModules = new Elysia()
	.use(jwtPlugin)
	.get(
		'/categories',
		async ({ query }) => {
			const result = await handlerCategories(query);

			return Response.json({
				code: 'success',
				message: 'Success retrieve data',
				statusCode: 200,
				data: result.data,
				total: result.total,
				skip: query.skip || 0,
				limit: query.limit || 10,
			} satisfies ResponseCategoryModelType['categories']);
		},
		{
			query: CategoryModel.queries,
			response: {
				...errorPlugin.decorator.ctxError.model(),
				200: ResponseCategoryModel.categories,
			},
		},
	)
	.post(
		'/categories',
		async ({ jwt, headers, body }) => {
			await handlerJwtAuth(jwt.verify, {
				bearerToken: headers.authorization,
				role: ['ADMIN', 'STAFF'],
			});

			const result = await handlerCreateCategory(body);

			return Response.json(
				{
					code: 'success',
					message: 'Success create data',
					statusCode: 201,
					data: result,
				} satisfies ResponseCategoryModelType['category'],
				{
					status: 201,
				},
			);
		},
		{
			body: CategoryModel.create,
			response: {
				...errorPlugin.decorator.ctxError.model(),
				201: ResponseCategoryModel.category,
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
		'/categories/:id',
		async ({ jwt, headers, query, params }) => {
			await handlerJwtAuth(jwt.verify, {
				bearerToken: headers.authorization,
				role: ['ADMIN', 'STAFF'],
			});

			const category = await handlerCategory(params.id, query);

			return Response.json({
				code: 'success',
				message: 'Success retrieve data',
				statusCode: 200,
				data: category,
			} satisfies ResponseCategoryModelType['category']);
		},
		{
			params: t.Pick(CategoryModel.params, ['id']),
			query: CategoryModel.query,
			response: {
				...errorPlugin.decorator.ctxError.model(),
				200: ResponseCategoryModel.category,
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
		'/categories/:id',
		async ({ jwt, headers, body, params }) => {
			await handlerJwtAuth(jwt.verify, {
				bearerToken: headers.authorization,
				role: ['ADMIN', 'STAFF'],
			});

			const category = await handlerUpdateCategory(params.id, body);

			return Response.json({
				code: 'success',
				message: 'Success update data',
				statusCode: 200,
				data: category,
			} satisfies ResponseCategoryModelType['category']);
		},
		{
			params: t.Pick(CategoryModel.params, ['id']),
			body: CategoryModel.update,
			response: {
				...errorPlugin.decorator.ctxError.model(),
				200: ResponseCategoryModel.category,
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
		'/categories/:id',
		async ({ jwt, headers, params }) => {
			await handlerJwtAuth(jwt.verify, {
				bearerToken: headers.authorization,
				role: ['ADMIN', 'STAFF'],
			});

			await handlerDeleteCategory(params.id);

			return Response.json({
				code: 'success',
				message: 'Success delete data',
				statusCode: 200,
			} satisfies ResponseCategoryModelType['delete']);
		},
		{
			params: t.Pick(CategoryModel.params, ['id']),
			response: {
				...errorPlugin.decorator.ctxError.model(),
				200: ResponseCategoryModel.delete,
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
