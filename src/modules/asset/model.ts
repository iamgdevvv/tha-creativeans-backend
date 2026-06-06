import { t, type UnwrapSchema } from 'elysia';

import type { Asset } from '#generated/prisma/client';
import { AssetPlain } from '#generated/prismabox/Asset';
import { tEnumsModel, tPickModel, tQueries } from '#utils/model/general';

export const AssetModel = {
	params: tPickModel(AssetPlain, ['filename', 'path']),
	queries: tQueries([
		t.Partial(tPickModel(AssetPlain, ['filename', 'path', 'userId', 'createdAt'])),
		t.Object({
			select: t.Optional(tEnumsModel<Asset>(['filename', 'path', 'userId', 'createdAt'])),
			desc: t.Optional(tEnumsModel<Asset>(['filename', 'path', 'userId', 'createdAt'])),
			asc: t.Optional(tEnumsModel<Asset>(['filename', 'path', 'userId', 'createdAt'])),
		}),
	]),
	upload: t.Composite([
		tPickModel(AssetPlain, ['path']),
		t.Object({
			file: t.File({
				type: 'image',
				maxSize: '6m',
			}),
		}),
	]),
} as const;

export type AssetModelType = {
	[k in keyof typeof AssetModel]: UnwrapSchema<(typeof AssetModel)[k]>;
};
