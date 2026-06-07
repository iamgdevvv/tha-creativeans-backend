import {
	ForbiddenException,
	NotImplementedException,
	UnauthorizedException,
} from 'elysia-http-exception';
import type { JWTVerifyOptions } from 'jose';

import { UserRole } from '#generated/prisma/enums';
import { prisma } from '#libs/prisma';
import { handlerCreateUser } from '#modules/user/service';
import type { JWTPayloadModelSpec } from '#plugins/jwt';
import dayjs from '#utils/dayjs';
import { verifyCreds } from '#utils/lib';

import type { AuthModelType } from './model';
import type { ResponseAuthModelType } from './response.model';

export const handlerLoginOauth = async (userInfo: {
	email: string;
	name: string;
}): Promise<ResponseAuthModelType['oauth']['data']> => {
	const userRecord = await prisma.user.findUnique({
		where: {
			email: userInfo.email,
		},
	});

	if (userRecord) {
		if (!userRecord.isActive) {
			throw new UnauthorizedException('User was deactivated');
		}

		return userRecord;
	}

	return await prisma.user.create({
		data: {
			email: userInfo.email,
			name: userInfo.name,
		},
	});
};

export const handlerLoginAuth = async (
	payload: AuthModelType['login'],
): Promise<ResponseAuthModelType['login']['data']> => {
	const userRecord = await prisma.user.findUniqueOrThrow({
		where: {
			email: payload.email,
		},
		include: {
			auth: {
				select: {
					hash: true,
				},
			},
		},
	});

	const { auth, ...user } = userRecord;

	if (!user.isActive) {
		throw new ForbiddenException('User is not active');
	}

	if (!auth) {
		throw new NotImplementedException('Auth is not implemented');
	}

	const isPasswordMatch = await verifyCreds(payload.password, auth.hash);

	if (!isPasswordMatch) {
		throw new UnauthorizedException('Credentials are invalid');
	}

	return user;
};

export const handlerRegisterAuth = async (
	payload: AuthModelType['register'],
): Promise<ResponseAuthModelType['register']['data']> => {
	const userPayload = payload;

	return await handlerCreateUser({
		...userPayload,
		role: UserRole.CUSTOMER,
		isActive: true,
	});
};

export const handlerJwtAuth = async (
	jwtVerify: (jwt?: string, options?: JWTVerifyOptions) => Promise<false | JWTPayloadModelSpec>,
	payload: {
		bearerToken?: string;
		userId?: string;
		productId?: string;
		role?: UserRole[];
	},
) => {
	const { bearerToken, userId, productId, role } = payload;

	if (!bearerToken) {
		throw new UnauthorizedException('Bearer token is missing');
	}

	const [jwtType, token] = bearerToken.trim().split(/\s+/);

	if (jwtType?.toLowerCase() !== 'bearer' || !token) {
		throw new UnauthorizedException('Bearer token is invalid format');
	}

	if (!token) {
		throw new UnauthorizedException('Bearer token is required');
	}

	const authJwt = await jwtVerify(token);

	if (!authJwt) {
		throw new UnauthorizedException('Bearer token is invalid');
	}

	if (authJwt.exp && dayjs(authJwt.exp * 1000).isBefore(dayjs())) {
		throw new UnauthorizedException('Bearer token is expired');
	}

	const user = await prisma.user.findUnique({
		where: {
			id: authJwt.userId,
		},
		select: {
			role: true,
			isActive: true,
		},
	});

	if (!user) {
		throw new UnauthorizedException('User is not found');
	}

	if (!user.isActive) {
		throw new ForbiddenException('User is not active');
	}

	if (!role || !role.includes(user.role)) {
		if (productId || userId) {
			if (productId) {
				const product = await prisma.product.findUnique({
					where: {
						id: productId,
						userId: authJwt.userId,
					},
					select: {
						id: true,
					},
				});

				if (!product) {
					throw new ForbiddenException('User product is not authorized');
				}
			}

			if (userId && userId !== authJwt.userId) {
				throw new ForbiddenException('User is not authorized');
			}
		} else if (role && !role.includes(user.role)) {
			throw new ForbiddenException('User is not authorized');
		}
	}

	return {
		...user,
		userId: authJwt.userId,
	};
};
