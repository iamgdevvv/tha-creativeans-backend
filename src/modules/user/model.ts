import { t, type UnwrapSchema } from 'elysia';

import { type User } from '#generated/prisma/client';
import { UserPlain, UserRelations } from '#generated/prismabox/User';
import { tEnumsModel, tPickModel, tQueries } from '#utils/model/general';

export const PickUserPublic = ['name', 'email'] satisfies (keyof User)[];
export type PickUserPublicType = (typeof PickUserPublic)[number];
export const UserPublicPlain = t.Pick(UserPlain, PickUserPublic);
export type UserRelationsType = UnwrapSchema<typeof UserRelations>;

const SelectIncludeModel = t.Object({
	select: t.Optional(
		tEnumsModel<User>(['id', 'name', 'email', 'role', 'isActive', 'createdAt', 'updatedAt']),
	),
	include: t.Optional(tEnumsModel<UserRelationsType>(['products'])),
});

export const UserModel = {
	params: tPickModel(UserPlain, ['id']),
	queries: tQueries([
		SelectIncludeModel,
		t.Partial(
			tPickModel(UserPlain, ['name', 'email', 'role', 'isActive', 'createdAt', 'updatedAt']),
		),
		t.Object({
			desc: t.Optional(
				tEnumsModel<User>(['name', 'email', 'role', 'isActive', 'createdAt', 'updatedAt']),
			),
			asc: t.Optional(
				tEnumsModel<User>(['name', 'email', 'role', 'isActive', 'createdAt', 'updatedAt']),
			),
		}),
	]),
	query: SelectIncludeModel,
	create: t.Composite([
		tPickModel(UserPlain, ['name', 'email', 'role', 'isActive']),
		t.Object({
			password: t.String({
				minLength: 1,
			}),
		}),
	]),
	update: t.Partial(tPickModel(UserPlain, ['name', 'email', 'role', 'isActive'])),
	updateProfile: t.Partial(tPickModel(UserPlain, ['name', 'email'])),
	updateProfilePassword: t.Object({
		password: t.String({
			minLength: 1,
		}),
		new_password: t.String({
			minLength: 1,
		}),
	}),
	updatePassword: t.Object({
		password: t.String({
			minLength: 1,
		}),
	}),
} as const;

export type UserModelType = {
	[k in keyof typeof UserModel]: UnwrapSchema<(typeof UserModel)[k]>;
};
