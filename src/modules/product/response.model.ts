import { t, type UnwrapSchema } from 'elysia';

import { ProductPlain, ProductRelations } from '#generated/prismabox/Product';
import { tPickModel } from '#utils/model/general';
import { ResponseModel } from '#utils/model/response';

import { ProductPublicPlain } from './model';

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
	productsPublic: ResponseModel({
		data: t.Array(ProductPublicPlain),
		metadata: {
			total: t.Number(),
			skip: t.Number(),
			limit: t.Number(),
		},
	}),
	productPublic: ResponseModel({
		data: ProductPublicPlain,
	}),
	delete: ResponseModel({
		statusCode: 200,
	}),
} as const;

export type ResponseProductModelType = {
	[k in keyof typeof ResponseProductModel]: UnwrapSchema<(typeof ResponseProductModel)[k]>;
};
