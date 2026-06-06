import { t, type UnwrapSchema } from 'elysia';

import { CategoryPlain, CategoryRelations } from '#generated/prismabox/Category';
import { tPickModel } from '#utils/model/general';
import { ResponseModel } from '#utils/model/response';

const DataModel = t.Composite([
	CategoryPlain,
	t.Partial(tPickModel(CategoryRelations, ['productCategories'])),
]);

export const ResponseCategoryModel = {
	categories: ResponseModel({
		data: t.Array(DataModel),
		metadata: {
			total: t.Number(),
			skip: t.Number(),
			limit: t.Number(),
		},
	}),
	category: ResponseModel({
		data: DataModel,
	}),
	delete: ResponseModel({
		statusCode: 200,
	}),
} as const;

export type ResponseCategoryModelType = {
	[k in keyof typeof ResponseCategoryModel]: UnwrapSchema<(typeof ResponseCategoryModel)[k]>;
};
