import { Elysia } from 'elysia';

import { handlerJwtAuth } from '#modules/auth/service';
import { errorPlugin } from '#plugins/error';
import { jwtPlugin } from '#plugins/jwt';

import { UserModel } from './model';
import { ResponseUserModel, type ResponseUserModelType } from './response.model';
import {
	handlerCreateUser,
	handlerDeleteUser,
	handlerUpdateUser,
	handlerUpdateUserPassword,
	handlerUpdateUserProfile,
	handlerUpdateUserProfilePassword,
	handlerUser,
	handlerUserMe,
	handlerUserMePassword,
	handlerUsers,
} from './service';

export const UserModules = new Elysia()
	.use(jwtPlugin)
	.get(
		'/users/me',
		async ({ headers, jwt }) => {
			const authUser = await handlerJwtAuth(jwt.verify, {
				bearerToken: headers.authorization,
			});

			const user = await handlerUserMe(authUser.userId);

			return Response.json({
				code: 'success',
				message: 'Success retrieve data',
				statusCode: 200,
				data: user,
			} satisfies ResponseUserModelType['me']);
		},
		{
			response: {
				...errorPlugin.decorator.ctxError.model(),
				200: ResponseUserModel.me,
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
		'/users/me/password',
		async ({ headers, jwt, body }) => {
			const authUser = await handlerJwtAuth(jwt.verify, {
				bearerToken: headers.authorization,
			});

			await handlerUserMePassword(authUser.userId, body);

			return Response.json({
				code: 'success',
				message: 'Success set password',
				statusCode: 200,
			} satisfies ResponseUserModelType['updatePassword']);
		},
		{
			body: UserModel.updatePassword,
			response: {
				...errorPlugin.decorator.ctxError.model(),
				200: ResponseUserModel.updatePassword,
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
		'/users',
		async ({ jwt, headers, query }) => {
			await handlerJwtAuth(jwt.verify, {
				bearerToken: headers.authorization,
				role: ['ADMIN'],
			});

			const result = await handlerUsers(query);

			return Response.json({
				code: 'success',
				message: 'Success retrieve data',
				statusCode: 200,
				data: result.data,
				total: result.total,
				skip: query.skip || 0,
				limit: query.limit || 10,
			} satisfies ResponseUserModelType['users']);
		},
		{
			query: UserModel.queries,
			response: {
				...errorPlugin.decorator.ctxError.model(),
				200: ResponseUserModel.users,
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
		'/users',
		async ({ headers, jwt, body }) => {
			await handlerJwtAuth(jwt.verify, {
				bearerToken: headers.authorization,
				role: ['ADMIN'],
			});

			const result = await handlerCreateUser(body);

			return Response.json(
				{
					code: 'success',
					message: 'Success create data',
					statusCode: 201,
					data: result,
				} satisfies ResponseUserModelType['user'],
				{
					status: 201,
				},
			);
		},
		{
			body: UserModel.create,
			response: {
				...errorPlugin.decorator.ctxError.model(),
				201: ResponseUserModel.user,
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
		'/users/:id',
		async ({ headers, jwt, query, params }) => {
			await handlerJwtAuth(jwt.verify, {
				bearerToken: headers.authorization,
				role: ['ADMIN'],
			});

			const user = await handlerUser(params.id, query);

			return Response.json({
				code: 'success',
				message: 'Success retrieve data',
				statusCode: 200,
				data: user,
			} satisfies ResponseUserModelType['user']);
		},
		{
			params: UserModel.params,
			query: UserModel.query,
			response: {
				...errorPlugin.decorator.ctxError.model(),
				200: ResponseUserModel.user,
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
		'/users/:id',
		async ({ headers, jwt, body, params }) => {
			await handlerJwtAuth(jwt.verify, {
				bearerToken: headers.authorization,
				role: ['ADMIN'],
			});

			const user = await handlerUpdateUser(params.id, body);

			return Response.json({
				code: 'success',
				message: 'Success update data',
				statusCode: 200,
				data: user,
			} satisfies ResponseUserModelType['user']);
		},
		{
			params: UserModel.params,
			body: UserModel.update,
			response: {
				...errorPlugin.decorator.ctxError.model(),
				200: ResponseUserModel.user,
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
		'/users/profile',
		async ({ headers, jwt, body }) => {
			const authUser = await handlerJwtAuth(jwt.verify, {
				bearerToken: headers.authorization,
			});

			const user = await handlerUpdateUserProfile(authUser.userId, body);

			return Response.json({
				code: 'success',
				message: 'Success update data',
				statusCode: 200,
				data: user,
			} satisfies ResponseUserModelType['user']);
		},
		{
			body: UserModel.updateProfile,
			response: {
				...errorPlugin.decorator.ctxError.model(),
				200: ResponseUserModel.user,
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
		'/users/profile/password',
		async ({ headers, jwt, body }) => {
			const authUser = await handlerJwtAuth(jwt.verify, {
				bearerToken: headers.authorization,
			});

			await handlerUpdateUserProfilePassword(authUser.userId, body);

			return Response.json({
				code: 'success',
				message: 'Success update data',
				statusCode: 200,
			} satisfies ResponseUserModelType['updatePassword']);
		},
		{
			body: UserModel.updateProfilePassword,
			response: {
				...errorPlugin.decorator.ctxError.model(),
				200: ResponseUserModel.updatePassword,
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
		'/users/:id/password',
		async ({ headers, jwt, body, params }) => {
			await handlerJwtAuth(jwt.verify, {
				bearerToken: headers.authorization,
				role: ['ADMIN'],
				userId: params.id,
			});

			await handlerUpdateUserPassword(params.id, body);

			return Response.json({
				code: 'success',
				message: 'Success update password',
				statusCode: 200,
			} satisfies ResponseUserModelType['updatePassword']);
		},
		{
			params: UserModel.params,
			body: UserModel.updatePassword,
			response: {
				...errorPlugin.decorator.ctxError.model(),
				200: ResponseUserModel.updatePassword,
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
		'/users/:id',
		async ({ headers, jwt, params }) => {
			await handlerJwtAuth(jwt.verify, {
				bearerToken: headers.authorization,
				role: ['ADMIN'],
			});

			await handlerDeleteUser(params.id);

			return Response.json({
				code: 'success',
				message: 'Success delete data',
				statusCode: 200,
			} satisfies ResponseUserModelType['delete']);
		},
		{
			params: UserModel.params,
			response: {
				...errorPlugin.decorator.ctxError.model(),
				200: ResponseUserModel.delete,
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
