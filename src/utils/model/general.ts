import type { TObject } from '@sinclair/typebox';
import { t, type TSchema } from 'elysia';
import type { NonEmptyArray } from 'elysia/type-system/types';

export function tQueries<const T extends readonly TSchema[]>(models: T) {
	return t.Composite([
		t.Object({
			limit: t.Optional(t.Number({ minimum: 1 })),
			skip: t.Optional(t.Number({ minimum: 0 })),
			q: t.Optional(t.String()),
		}),
		...models,
	]);
}

export function tPickModel<
	const T extends TObject,
	const K extends NonEmptyArray<keyof T['properties']>,
>(model: T, enums: K) {
	return t.Pick<T, K>(model, enums);
}

export function tEnumsModel<const T extends Record<string, unknown>>(
	enums: NonEmptyArray<Extract<keyof T, string>>,
) {
	return t.Array(t.UnionEnum(enums), {
		uniqueItems: true,
	});
}
