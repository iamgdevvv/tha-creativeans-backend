import Elysia, { InvertedStatusMap, type ErrorHandler } from 'elysia';
import { HttpException } from 'elysia-http-exception';

import { Prisma } from '#generated/prisma/client';
import {
	ResponseModel,
	type HTTPErrorCode,
	type ResponseErrorModelType,
	type ResponseModelType,
} from '#utils/model/response';

export const errorPlugin = new Elysia().decorate('ctxError', {
	model: (
		codes: HTTPErrorCode[] = [400, 401, 403, 404, 500],
	): Record<HTTPErrorCode, ResponseErrorModelType> => {
		const responseModel = {} as Record<HTTPErrorCode, ResponseErrorModelType>;

		codes.forEach((code) => {
			responseModel[code] = ResponseModel({
				error: InvertedStatusMap[code],
				statusCode: code,
			}) as unknown as ResponseErrorModelType;
		});

		return responseModel;
	},
	response: ({ code, error, path }: Parameters<ErrorHandler>[0]) => {
		console.error({
			code,
			path,
			error,
			// ctx,
		});

		if (error instanceof HttpException) {
			return Response.json(
				{
					code: 'error',
					statusCode: error.statusCode as ResponseModelType['error']['statusCode'],
					message: error.message,
				} satisfies ResponseModelType['error'],
				{
					status: error.statusCode,
				},
			);
		}

		if (code === 'PARSE') {
			return Response.json(
				{
					code: 'error',
					statusCode: 422,
					message: 'Unprocessable Entity',
				} satisfies ResponseModelType['error'],
				{
					status: 422,
				},
			);
		}

		if (code === 'VALIDATION') {
			return Response.json(
				{
					code: 'error',
					statusCode: 400,
					message: 'Invalid request',
				} satisfies ResponseModelType['error'],
				{
					status: 400,
				},
			);
		}

		if (code === 'NOT_FOUND') {
			return Response.json(
				{
					code: 'error',
					statusCode: 404,
					message: 'Not found',
				} satisfies ResponseModelType['error'],
				{
					status: 404,
				},
			);
		}

		if (code === 'INTERNAL_SERVER_ERROR') {
			return Response.json(
				{
					code: 'error',
					statusCode: 500,
					message: 'Internal Server Error',
				} satisfies ResponseModelType['error'],
				{
					status: 500,
				},
			);
		}

		if (code === 'INVALID_COOKIE_SIGNATURE') {
			return Response.json(
				{
					code: 'error',
					statusCode: 401,
					message: 'Unauthorized',
				} satisfies ResponseModelType['error'],
				{
					status: 401,
				},
			);
		}

		if (code === 'INVALID_FILE_TYPE') {
			return Response.json(
				{
					code: 'error',
					statusCode: 415,
					message: 'Unsupported Media Type',
				} satisfies ResponseModelType['error'],
				{
					status: 415,
				},
			);
		}

		if (typeof code === 'string') {
			const customCode: string = code;

			if (customCode === 'P1000') {
				return Response.json(
					{
						code: 'error',
						statusCode: 500,
						message: 'Database connection error',
					} satisfies ResponseModelType['error'],
					{ status: 500 },
				);
			}

			if (customCode === 'P1001') {
				return Response.json(
					{
						code: 'error',
						statusCode: 500,
						message: "Can't reach database server",
					} satisfies ResponseModelType['error'],
					{ status: 500 },
				);
			}

			if (customCode === 'P1002') {
				return Response.json(
					{
						code: 'error',
						statusCode: 500,
						message: 'Database connection timed out',
					} satisfies ResponseModelType['error'],
					{ status: 500 },
				);
			}

			if (customCode === 'P1003') {
				return Response.json(
					{
						code: 'error',
						statusCode: 404,
						message: 'Database does not exist',
					} satisfies ResponseModelType['error'],
					{ status: 404 },
				);
			}

			if (customCode === 'P1008') {
				return Response.json(
					{
						code: 'error',
						statusCode: 500,
						message: 'Operations timed out',
					} satisfies ResponseModelType['error'],
					{ status: 500 },
				);
			}

			if (customCode === 'P1009') {
				return Response.json(
					{
						code: 'error',
						statusCode: 409,
						message: 'Database already exists',
					} satisfies ResponseModelType['error'],
					{ status: 409 },
				);
			}

			if (customCode === 'P1010') {
				return Response.json(
					{
						code: 'error',
						statusCode: 403,
						message: 'Access denied for user',
					} satisfies ResponseModelType['error'],
					{ status: 403 },
				);
			}

			if (customCode === 'P1011') {
				return Response.json(
					{
						code: 'error',
						statusCode: 500,
						message: 'TLS connection error',
					} satisfies ResponseModelType['error'],
					{ status: 500 },
				);
			}

			if (customCode === 'P1012') {
				return Response.json(
					{
						code: 'error',
						statusCode: 400,
						message: 'Schema validation error',
					} satisfies ResponseModelType['error'],
					{ status: 400 },
				);
			}

			if (customCode === 'P1013') {
				return Response.json(
					{
						code: 'error',
						statusCode: 400,
						message: 'Invalid database connection string',
					} satisfies ResponseModelType['error'],
					{ status: 400 },
				);
			}

			if (customCode === 'P1014') {
				return Response.json(
					{
						code: 'error',
						statusCode: 500,
						message: 'Underlying kind error',
					} satisfies ResponseModelType['error'],
					{ status: 500 },
				);
			}

			if (customCode === 'P1015') {
				return Response.json(
					{
						code: 'error',
						statusCode: 400,
						message: 'Unsupported feature in database',
					} satisfies ResponseModelType['error'],
					{ status: 400 },
				);
			}

			if (customCode === 'P1016') {
				return Response.json(
					{
						code: 'error',
						statusCode: 500,
						message: 'Query engine error',
					} satisfies ResponseModelType['error'],
					{ status: 500 },
				);
			}

			if (customCode === 'P1017') {
				return Response.json(
					{
						code: 'error',
						statusCode: 500,
						message: 'Server closed the connection',
					} satisfies ResponseModelType['error'],
					{ status: 500 },
				);
			}

			if (customCode === 'P2000') {
				return Response.json(
					{
						code: 'error',
						statusCode: 400,
						message: 'Value too long for column',
					} satisfies ResponseModelType['error'],
					{ status: 400 },
				);
			}

			if (customCode === 'P2001') {
				return Response.json(
					{
						code: 'error',
						statusCode: 404,
						message: 'Record not found',
					} satisfies ResponseModelType['error'],
					{ status: 404 },
				);
			}

			if (customCode === 'P2002') {
				return Response.json(
					{
						code: 'error',
						statusCode: 409,
						message: 'Unique constraint violation',
					} satisfies ResponseModelType['error'],
					{ status: 409 },
				);
			}

			if (customCode === 'P2003') {
				return Response.json(
					{
						code: 'error',
						statusCode: 409,
						message: 'Foreign key constraint violation',
					} satisfies ResponseModelType['error'],
					{ status: 409 },
				);
			}

			if (customCode === 'P2004') {
				return Response.json(
					{
						code: 'error',
						statusCode: 400,
						message: 'Constraint violation',
					} satisfies ResponseModelType['error'],
					{ status: 400 },
				);
			}

			if (customCode === 'P2005') {
				return Response.json(
					{
						code: 'error',
						statusCode: 400,
						message: 'Invalid value type for field',
					} satisfies ResponseModelType['error'],
					{ status: 400 },
				);
			}

			if (customCode === 'P2006') {
				return Response.json(
					{
						code: 'error',
						statusCode: 400,
						message: 'Invalid value for field',
					} satisfies ResponseModelType['error'],
					{ status: 400 },
				);
			}

			if (customCode === 'P2007') {
				return Response.json(
					{
						code: 'error',
						statusCode: 400,
						message: 'Data validation error',
					} satisfies ResponseModelType['error'],
					{ status: 400 },
				);
			}

			if (customCode === 'P2008') {
				return Response.json(
					{
						code: 'error',
						statusCode: 500,
						message: 'Failed to parse query',
					} satisfies ResponseModelType['error'],
					{ status: 500 },
				);
			}

			if (customCode === 'P2009') {
				return Response.json(
					{
						code: 'error',
						statusCode: 400,
						message: 'Failed to validate query',
					} satisfies ResponseModelType['error'],
					{ status: 400 },
				);
			}

			if (customCode === 'P2010') {
				return Response.json(
					{
						code: 'error',
						statusCode: 500,
						message: 'Raw query failed',
					} satisfies ResponseModelType['error'],
					{ status: 500 },
				);
			}

			if (customCode === 'P2011') {
				return Response.json(
					{
						code: 'error',
						statusCode: 400,
						message: 'Null constraint violation',
					} satisfies ResponseModelType['error'],
					{ status: 400 },
				);
			}

			if (customCode === 'P2012') {
				return Response.json(
					{
						code: 'error',
						statusCode: 400,
						message: 'Missing required value',
					} satisfies ResponseModelType['error'],
					{ status: 400 },
				);
			}

			if (customCode === 'P2013') {
				return Response.json(
					{
						code: 'error',
						statusCode: 400,
						message: 'Missing required argument',
					} satisfies ResponseModelType['error'],
					{ status: 400 },
				);
			}

			if (customCode === 'P2014') {
				return Response.json(
					{
						code: 'error',
						statusCode: 400,
						message: 'Relation violation',
					} satisfies ResponseModelType['error'],
					{ status: 400 },
				);
			}

			if (customCode === 'P2015') {
				return Response.json(
					{
						code: 'error',
						statusCode: 404,
						message: 'Related record not found',
					} satisfies ResponseModelType['error'],
					{ status: 404 },
				);
			}

			if (customCode === 'P2016') {
				return Response.json(
					{
						code: 'error',
						statusCode: 400,
						message: 'Query interpretation error',
					} satisfies ResponseModelType['error'],
					{ status: 400 },
				);
			}

			if (customCode === 'P2017') {
				return Response.json(
					{
						code: 'error',
						statusCode: 400,
						message: 'Relation not connected',
					} satisfies ResponseModelType['error'],
					{ status: 400 },
				);
			}

			if (customCode === 'P2018') {
				return Response.json(
					{
						code: 'error',
						statusCode: 404,
						message: 'Required connected records not found',
					} satisfies ResponseModelType['error'],
					{ status: 404 },
				);
			}

			if (customCode === 'P2019') {
				return Response.json(
					{
						code: 'error',
						statusCode: 400,
						message: 'Input error',
					} satisfies ResponseModelType['error'],
					{ status: 400 },
				);
			}

			if (customCode === 'P2020') {
				return Response.json(
					{
						code: 'error',
						statusCode: 400,
						message: 'Value out of range',
					} satisfies ResponseModelType['error'],
					{ status: 400 },
				);
			}

			if (customCode === 'P2021') {
				return Response.json(
					{
						code: 'error',
						statusCode: 500,
						message: 'Table does not exist',
					} satisfies ResponseModelType['error'],
					{ status: 500 },
				);
			}

			if (customCode === 'P2022') {
				return Response.json(
					{
						code: 'error',
						statusCode: 500,
						message: 'Column does not exist',
					} satisfies ResponseModelType['error'],
					{ status: 500 },
				);
			}

			if (customCode === 'P2023') {
				return Response.json(
					{
						code: 'error',
						statusCode: 500,
						message: 'Inconsistent column data',
					} satisfies ResponseModelType['error'],
					{ status: 500 },
				);
			}

			if (customCode === 'P2024') {
				return Response.json(
					{
						code: 'error',
						statusCode: 500,
						message: 'Timed out while fetching response from database',
					} satisfies ResponseModelType['error'],
					{ status: 500 },
				);
			}

			if (customCode === 'P2025') {
				return Response.json(
					{
						code: 'error',
						statusCode: 404,
						message: 'Record not found',
					} satisfies ResponseModelType['error'],
					{ status: 404 },
				);
			}

			if (customCode === 'P2026') {
				return Response.json(
					{
						code: 'error',
						statusCode: 500,
						message: 'Query engine error',
					} satisfies ResponseModelType['error'],
					{ status: 500 },
				);
			}

			if (customCode === 'P2027') {
				return Response.json(
					{
						code: 'error',
						statusCode: 500,
						message: 'Multiple errors occurred',
					} satisfies ResponseModelType['error'],
					{ status: 500 },
				);
			}

			if (customCode === 'P2028') {
				return Response.json(
					{
						code: 'error',
						statusCode: 500,
						message: 'Transaction API error',
					} satisfies ResponseModelType['error'],
					{ status: 500 },
				);
			}

			if (customCode === 'P2030') {
				return Response.json(
					{
						code: 'error',
						statusCode: 500,
						message: 'Full-text search error',
					} satisfies ResponseModelType['error'],
					{ status: 500 },
				);
			}

			if (customCode === 'P2031') {
				return Response.json(
					{
						code: 'error',
						statusCode: 500,
						message: 'Transaction failed',
					} satisfies ResponseModelType['error'],
					{ status: 500 },
				);
			}

			if (customCode === 'P2033') {
				return Response.json(
					{
						code: 'error',
						statusCode: 400,
						message: 'Number out of 64-bit range',
					} satisfies ResponseModelType['error'],
					{ status: 400 },
				);
			}

			if (customCode === 'P2034') {
				return Response.json(
					{
						code: 'error',
						statusCode: 409,
						message: 'Transaction conflict / write conflict',
					} satisfies ResponseModelType['error'],
					{ status: 409 },
				);
			}

			if (customCode === 'P2035') {
				return Response.json(
					{
						code: 'error',
						statusCode: 500,
						message: 'Database does not exist',
					} satisfies ResponseModelType['error'],
					{ status: 500 },
				);
			}

			if (customCode === 'P2036') {
				return Response.json(
					{
						code: 'error',
						statusCode: 500,
						message: 'Query engine protocol error',
					} satisfies ResponseModelType['error'],
					{ status: 500 },
				);
			}

			if (customCode === 'P2037') {
				return Response.json(
					{
						code: 'error',
						statusCode: 503,
						message: 'Too many database connections',
					} satisfies ResponseModelType['error'],
					{ status: 503 },
				);
			}
		}

		if (error instanceof Prisma.PrismaClientValidationError) {
			return Response.json(
				{
					code: 'error',
					statusCode: 400,
					message: 'Invalid request',
				} satisfies ResponseModelType['error'],
				{
					status: 400,
				},
			);
		}

		if (error instanceof Prisma.PrismaClientKnownRequestError) {
			return Response.json(
				{
					code: 'error',
					statusCode: 409,
					message: 'Invalid request unique constraint',
				} satisfies ResponseModelType['error'],
				{
					status: 409,
				},
			);
		}

		if (error instanceof Prisma.PrismaClientInitializationError) {
			return Response.json(
				{
					code: 'error',
					statusCode: 500,
					message: 'Database connection error',
				} satisfies ResponseModelType['error'],
				{
					status: 500,
				},
			);
		}

		if (error instanceof Prisma.PrismaClientUnknownRequestError) {
			return Response.json(
				{
					code: 'error',
					statusCode: 500,
					message: 'Unexpected database error',
				} satisfies ResponseModelType['error'],
				{
					status: 500,
				},
			);
		}

		return Response.json(
			{
				code: 'error',
				statusCode: 500,
				message: 'An unexpected error occurred',
			} satisfies ResponseModelType['error'],
			{
				status: 500,
			},
		);
	},
});
