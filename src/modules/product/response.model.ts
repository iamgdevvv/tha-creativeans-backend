import { t, type UnwrapSchema } from 'elysia';

import { CategoryPlain } from '#generated/prismabox/Category';
import { ProductPlain, ProductRelations } from '#generated/prismabox/Product';
import { tPickModel } from '#utils/model/general';
import { ResponseModel } from '#utils/model/response';

const DataModel = t.Composite([
	ProductPlain,
	t.Partial(tPickModel(ProductRelations, ['user', 'productThumbnails', 'productCategories'])),
]);

export const ResponseProductModel = {
	products: ResponseModel({
		data: t.Array(DataModel),
		metadata: {
			total: t.Number(),
			skip: t.Number(),
			limit: t.Number(),
		},
	}),
	product: ResponseModel({
		data: DataModel,
	}),
	productBySlug: ResponseModel({
		data: t.Composite([
			t.Omit(ProductPlain, ['userId']),
			t.Object({
				thumbnails: t.Array(t.String()),
				categories: t.Array(CategoryPlain),
			}),
		]),
	}),
	delete: ResponseModel({
		statusCode: 200,
	}),
} as const;

export type ResponseProductModelType = {
	[k in keyof typeof ResponseProductModel]: UnwrapSchema<(typeof ResponseProductModel)[k]>;
};
