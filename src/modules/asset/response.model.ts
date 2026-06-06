import { t, type UnwrapSchema } from 'elysia';

import { AssetPlain } from '#generated/prismabox/Asset';
import { ResponseModel } from '#utils/model/response';

export const ResponseAssetModel = {
	assets: ResponseModel({
		data: t.Array(AssetPlain),
		metadata: {
			total: t.Number(),
			skip: t.Number(),
			limit: t.Number(),
		},
	}),
	upload: ResponseModel({
		data: AssetPlain,
	}),
	delete: ResponseModel({
		statusCode: 200,
	}),
} as const;

export type ResponseAssetModelType = {
	[k in keyof typeof ResponseAssetModel]: UnwrapSchema<(typeof ResponseAssetModel)[k]>;
};
