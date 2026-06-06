import type { TObject, TSchema } from '@sinclair/typebox';
import { InvertedStatusMap, t, type UnwrapSchema } from 'elysia';

type HTTPStatusCode = keyof InvertedStatusMap;

export type HTTPSuccessCode = HTTPStatusCode extends infer S
	? S extends number
		? S extends 100 | 101 | 102 | 103
			? S
			: S extends 200 | 201 | 202 | 203 | 204 | 205 | 206 | 207 | 208
				? S
				: S extends 300 | 301 | 302 | 303 | 304 | 307 | 308
					? S
					: never
		: never
	: never;

export type HTTPErrorCode = Exclude<HTTPStatusCode, HTTPSuccessCode>;

export const HTTP_SUCCESS_CODES: HTTPSuccessCode[] = [
	100, 101, 102, 103, 200, 201, 202, 203, 204, 205, 206, 207, 208, 300, 301, 302, 303, 304, 307,
	308,
];
export const HTTP_ERROR_CODES: HTTPErrorCode[] = [
	400, 401, 402, 403, 404, 405, 406, 407, 408, 409, 410, 411, 412, 413, 414, 415, 416, 417, 418,
	421, 422, 423, 424, 425, 426, 428, 429, 431, 451, 500, 501, 502, 503, 504, 505, 506, 507, 508,
	510, 511,
];

type ResponseSuccessModelType<S extends HTTPSuccessCode = HTTPSuccessCode> = TObject<{
	code: ReturnType<typeof t.Literal<'success'>>;
	message: ReturnType<typeof t.String>;
	statusCode: ReturnType<typeof t.Literal<S>>;
}>;

type ResponseSuccessWithDataModelType<
	S extends HTTPSuccessCode = HTTPSuccessCode,
	D extends TSchema = TSchema,
	MD extends Record<string, TSchema> = {},
> = TObject<
	{
		code: ReturnType<typeof t.Literal<'success'>>;
		message: ReturnType<typeof t.String>;
		statusCode: ReturnType<typeof t.Literal<S>>;
		data: D;
	} & MD
>;

export type ResponseErrorModelType<
	S extends HTTPErrorCode = HTTPErrorCode,
	M extends string | undefined = undefined,
> = TObject<{
	code: ReturnType<typeof t.Literal<'error'>>;
	message: M extends string ? ReturnType<typeof t.Literal<M>> : ReturnType<typeof t.String>;
	statusCode: ReturnType<typeof t.Literal<S>>;
}>;

export type ResponseModelType = {
	success: UnwrapSchema<ResponseSuccessModelType>;
	successWithData: UnwrapSchema<ResponseSuccessWithDataModelType>;
	error: UnwrapSchema<ResponseErrorModelType>;
};

export function ResponseModel<
	S extends HTTPSuccessCode = HTTPSuccessCode,
	D extends TSchema = TSchema,
	MD extends Record<string, TSchema> = {},
>(args: {
	statusCode?: S;
	data: D;
	metadata?: MD;
	error?: never;
}): ResponseSuccessWithDataModelType<S, D, MD>;

export function ResponseModel<
	S extends HTTPErrorCode = HTTPErrorCode,
	M extends string = string,
>(args: { statusCode?: S; error: M; data?: never }): ResponseErrorModelType<S, M>;

export function ResponseModel<S extends HTTPSuccessCode = HTTPSuccessCode>(args?: {
	statusCode?: S;
}): ResponseSuccessModelType<S>;

export function ResponseModel({
	statusCode,
	...options
}: { statusCode?: HTTPStatusCode } & (
	| { data?: TSchema; metadata?: Record<string, TSchema>; error?: never }
	| { error?: string; data?: never; metadata?: never }
) = {}): TObject {
	if (statusCode && statusCode >= 400) {
		return t.Object({
			code: t.Literal('error'),
			message: options.error ? t.Literal(options.error) : t.String(),
			statusCode: t.Literal(statusCode ?? 500),
		});
	}

	const BaseModel = t.Object({
		code: t.Literal('success'),
		message: t.String(),
		statusCode: t.Literal(statusCode ?? 200),
	});

	if (options.data) {
		return t.Object({
			...BaseModel.properties,
			...options.metadata,
			data: options.data,
		});
	}

	return BaseModel;
}
