import { t, type UnwrapSchema } from 'elysia';

import { UserPlain } from '#generated/prismabox/User';
import { tPickModel } from '#utils/model/general';

export const AuthModel = {
	login: t.Composite([
		tPickModel(UserPlain, ['email']),
		t.Object({
			password: t.String({
				minLength: 1,
			}),
		}),
	]),
	register: t.Composite([
		tPickModel(UserPlain, ['name', 'email']),
		t.Object({
			password: t.String({
				minLength: 1,
			}),
		}),
	]),
	oauth: t.Object({
		state: t.Optional(t.String()),
		code: t.String(),
		scope: t.Optional(t.String()),
		authuser: t.Optional(t.String()),
		prompt: t.Optional(t.String()),
	}),
} as const;

export type AuthModelType = {
	[k in keyof typeof AuthModel]: UnwrapSchema<(typeof AuthModel)[k]>;
};
