import { t, type UnwrapSchema } from 'elysia';

import { UserPlain } from '#generated/prismabox/User';
import { ResponseModel } from '#utils/model/response';

export const ResponseAuthModel = {
	oauth: t.Composite([
		ResponseModel({
			data: UserPlain,
		}),
		t.Object({
			token: t.String(),
		}),
	]),
	login: t.Composite([
		ResponseModel({
			data: UserPlain,
		}),
		t.Object({
			token: t.String(),
		}),
	]),
	register: ResponseModel({
		data: UserPlain,
	}),
} as const;

export type ResponseAuthModelType = {
	[k in keyof typeof ResponseAuthModel]: UnwrapSchema<(typeof ResponseAuthModel)[k]>;
};
