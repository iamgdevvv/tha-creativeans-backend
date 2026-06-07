import { BadRequestException, ForbiddenException } from 'elysia-http-exception';

import { Prisma } from '#generated/prisma/client';
import { prisma } from '#libs/prisma';
import dayjs from '#utils/dayjs';
import { hashCreds, valueOrSkip, verifyCreds } from '#utils/lib';

import type { UserModelType } from './model';
import type { ResponseUserModelType } from './response.model';

export const handlerUsers = async (
	queryParams?: UserModelType['queries'],
): Promise<Pick<ResponseUserModelType['users'], 'data' | 'total'>> => {
	const { limit, skip, q, desc, asc, include, select, ...payload } = queryParams || {};

	const argsWhereOR: Prisma.UserWhereInput[] = [];
	const argsOrderBy: Prisma.UserOrderByWithRelationInput[] = [];
	const argsSelect: Prisma.UserSelect = {};
	const argsInclude: Prisma.UserInclude = {};

	if (q) {
		const searchFields: Prisma.UserOrderByRelevanceFieldEnum[] = ['name', 'email'];

		searchFields.forEach((field) => {
			argsWhereOR.push({
				[field]: {
					contains: q,
				},
			});
		});
	}

	if (desc?.length) {
		desc.forEach((field) => {
			argsOrderBy.push({
				[field]: 'desc',
			});
		});
	}

	if (asc?.length) {
		asc.forEach((field) => {
			argsOrderBy.push({
				[field]: 'asc',
			});
		});
	}

	if (select) {
		select.forEach((field) => {
			argsSelect[field] = true;
		});
	}

	if (include) {
		if (Object.keys(argsSelect).length) {
			include.forEach((field) => {
				argsSelect[field] = true;
			});
		} else {
			include.forEach((field) => {
				argsInclude[field] = true;
			});
		}
	}

	const args: Prisma.UserFindManyArgs = {
		take: limit || 10,
		skip: skip || 0,
		orderBy: argsOrderBy.length ? argsOrderBy : Prisma.skip,
		where: {
			OR: argsWhereOR.length ? argsWhereOR : Prisma.skip,
			name: valueOrSkip(payload.name),
			email: valueOrSkip(payload.email),
			role: valueOrSkip(payload.role),
			isActive: valueOrSkip(payload.isActive),
			createdAt: payload.createdAt
				? {
						lte: dayjs(payload.createdAt).endOf('day').toDate(),
						gte: dayjs(payload.createdAt).startOf('day').toDate(),
					}
				: Prisma.skip,
			updatedAt: payload.updatedAt
				? {
						lte: dayjs(payload.updatedAt).endOf('day').toDate(),
						gte: dayjs(payload.updatedAt).startOf('day').toDate(),
					}
				: Prisma.skip,
		},
		...(Object.keys(argsSelect).length ? { select: argsSelect } : {}),
		...(Object.keys(argsInclude).length ? { include: argsInclude } : {}),
	};

	return {
		data: await prisma.user.findMany(args),
		total: await prisma.user.count({
			where: args.where,
		}),
	};
};

export const handlerUser = async (
	recordId: UserModelType['params']['id'],
	queryParams?: UserModelType['query'],
): Promise<ResponseUserModelType['user']['data']> => {
	const { include, select } = queryParams || {};

	const argsSelect: Prisma.UserSelect = {};
	const argsInclude: Prisma.UserInclude = {};

	if (select) {
		select.forEach((field) => {
			argsSelect[field] = true;
		});
	}

	if (include) {
		if (Object.keys(argsSelect).length) {
			include.forEach((field) => {
				argsSelect[field] = true;
			});
		} else {
			include.forEach((field) => {
				argsInclude[field] = true;
			});
		}
	}

	const args: Prisma.UserFindUniqueOrThrowArgs = {
		where: {
			id: recordId,
		},
		...(Object.keys(argsSelect).length ? { select: argsSelect } : {}),
		...(Object.keys(argsInclude).length ? { include: argsInclude } : {}),
	};

	return await prisma.user.findUniqueOrThrow(args);
};

export const handlerUserMe = async (
	recordId: UserModelType['params']['id'],
): Promise<ResponseUserModelType['me']['data']> => {
	const { auth, ...user } = await prisma.user.findUniqueOrThrow({
		where: {
			id: recordId,
		},
		select: {
			name: true,
			email: true,
			role: true,
			auth: {
				select: {
					userId: true,
				},
			},
		},
	});

	return {
		...user,
		hasAuth: !!auth,
	};
};

export const handlerUserMePassword = async (
	recordId: UserModelType['params']['id'],
	payload: UserModelType['updatePassword'],
) => {
	const authRecord = await prisma.auth.findUnique({
		where: {
			userId: recordId,
		},
		select: {
			userId: true,
		},
	});

	if (authRecord) throw new BadRequestException('Auth created');

	const hash = await hashCreds(payload.password);

	return await prisma.auth.create({
		data: {
			hash,
			userId: recordId,
		},
	});
};

export const handlerCreateUser = async (
	payload: UserModelType['create'],
): Promise<ResponseUserModelType['user']['data']> => {
	const { password, ...userPayload } = payload;

	const hash = await hashCreds(password);

	return await prisma.user.create({
		data: {
			...userPayload,
			auth: {
				create: {
					hash,
				},
			},
		},
	});
};

export const handlerUpdateUser = async (
	recordId: UserModelType['params']['id'],
	payload: UserModelType['update'],
): Promise<ResponseUserModelType['user']['data']> => {
	const { name, email, role, isActive } = payload;

	return await prisma.user.update({
		where: {
			id: recordId,
		},
		data: {
			name: valueOrSkip(name),
			email: valueOrSkip(email),
			role: valueOrSkip(role),
			isActive: valueOrSkip(isActive),
		},
	});
};

export const handlerDeleteUser = async (recordId: UserModelType['params']['id']) => {
	return await prisma.user.delete({
		where: {
			id: recordId,
		},
		select: {
			id: true,
		},
	});
};

export const handlerUpdateUserPassword = async (
	recordId: UserModelType['params']['id'],
	payload: UserModelType['updatePassword'],
) => {
	const authRecord = await prisma.auth.findUnique({
		where: {
			userId: recordId,
		},
		select: {
			userId: true,
		},
	});

	const hash = await hashCreds(payload.password);

	if (!authRecord) {
		return await prisma.auth.create({
			data: {
				hash,
				userId: recordId,
			},
			select: {
				userId: true,
			},
		});
	}

	return await prisma.auth.update({
		where: {
			userId: recordId,
		},
		data: {
			hash,
		},
		select: {
			userId: true,
		},
	});
};

export const handlerUpdateUserProfile = async (
	recordId: UserModelType['params']['id'],
	payload: UserModelType['updateProfile'],
): Promise<ResponseUserModelType['user']['data']> => {
	const { name, email } = payload;

	return await prisma.user.update({
		where: {
			id: recordId,
		},
		data: {
			name: valueOrSkip(name),
			email: valueOrSkip(email),
		},
	});
};

export const handlerUpdateUserProfilePassword = async (
	recordId: UserModelType['params']['id'],
	payload: UserModelType['updateProfilePassword'],
) => {
	const authRecord = await prisma.auth.findUniqueOrThrow({
		where: {
			userId: recordId,
		},
		select: {
			hash: true,
		},
	});

	const isPasswordMatch = await verifyCreds(payload.password, authRecord.hash);

	if (!isPasswordMatch) {
		throw new ForbiddenException('Password is incorrect');
	}

	const hash = await hashCreds(payload.new_password);

	return await prisma.auth.update({
		where: {
			userId: recordId,
		},
		data: {
			hash,
		},
		select: {
			userId: true,
		},
	});
};
