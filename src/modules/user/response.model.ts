import { t, type UnwrapSchema } from 'elysia';

import { UserPlain, UserRelations } from '#generated/prismabox/User';
import { tPickModel } from '#utils/model/general';
import { ResponseModel } from '#utils/model/response';

const DataModel = t.Composite([UserPlain, t.Partial(tPickModel(UserRelations, ['products']))]);

export const ResponseUserModel = {
	users: ResponseModel({
		data: t.Array(DataModel),
		metadata: {
			total: t.Number(),
			skip: t.Number(),
			limit: t.Number(),
		},
	}),
	user: ResponseModel({
		data: DataModel,
	}),
	delete: ResponseModel({
		statusCode: 200,
	}),
	updatePassword: ResponseModel({
		statusCode: 200,
	}),
	me: ResponseModel({
		data: t.Composite([
			t.Pick(UserPlain, ['name', 'email', 'role']),
			t.Object({
				hasAuth: t.Boolean(),
			}),
		]),
	}),
} as const;

export type ResponseUserModelType = {
	[k in keyof typeof ResponseUserModel]: UnwrapSchema<(typeof ResponseUserModel)[k]>;
};
