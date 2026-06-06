import { t, type UnwrapSchema } from 'elysia';

import { type Category } from '#generated/prisma/client';
import { CategoryPlain, CategoryRelations } from '#generated/prismabox/Category';
import { tEnumsModel, tPickModel, tQueries } from '#utils/model/general';

export type CategoryRelationsType = UnwrapSchema<typeof CategoryRelations>;

const SelectIncludeModel = t.Object({
	select: t.Optional(tEnumsModel<Category>(['id', 'name'])),
	include: t.Optional(tEnumsModel<CategoryRelationsType>(['productCategories'])),
});

export const CategoryModel = {
	params: tPickModel(CategoryPlain, ['id']),
	queries: tQueries([
		SelectIncludeModel,
		t.Partial(tPickModel(CategoryPlain, ['name'])),
		t.Object({
			desc: t.Optional(tEnumsModel<Category>(['name'])),
			asc: t.Optional(tEnumsModel<Category>(['name'])),
		}),
	]),
	query: SelectIncludeModel,
	create: tPickModel(CategoryPlain, ['name']),
	update: t.Partial(tPickModel(CategoryPlain, ['name'])),
} as const;

export type CategoryModelType = {
	[k in keyof typeof CategoryModel]: UnwrapSchema<(typeof CategoryModel)[k]>;
};
