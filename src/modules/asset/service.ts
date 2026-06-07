import { NotFoundException } from 'elysia-http-exception';

import { Prisma, UserRole } from '#generated/prisma/client';
import type { UserModel } from '#generated/prisma/models';
import { prisma } from '#libs/prisma';
import { s3 } from '#libs/s3';
import { createFile, slugify, valueOrSkip } from '#utils/lib';

import dayjs from '#utils/dayjs';

import type { AssetModelType } from './model';
import type { ResponseAssetModelType } from './response.model';

export const handerAsset = async (params: AssetModelType['params']) => {
	const file = s3.file(params.filename, {
		bucket: params.path,
	});

	const fileExist = await file.exists();

	if (!fileExist) {
		throw new NotFoundException('File not found');
	}

	return file;
};

type QueryParamAssets = AssetModelType['queries'] & {
	authId: string;
	authRole: UserRole;
};

export const handlerAssets = async (
	queryParams?: QueryParamAssets,
): Promise<Pick<ResponseAssetModelType['assets'], 'data' | 'total'>> => {
	const { limit, skip, q, desc, asc, authRole, authId, ...payload } = (queryParams ||
		{}) as QueryParamAssets;

	const argsWhereOR: Prisma.AssetWhereInput[] = [];
	const argsOrderBy: Prisma.AssetOrderByWithRelationInput[] = [];

	if (q) {
		const searchFields: Prisma.AssetOrderByRelevanceFieldEnum[] = ['filename'];

		searchFields.forEach((field) => {
			argsWhereOR.push({
				[field]: {
					contains: q,
					mode: 'insensitive',
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

	const args = {
		take: limit || 10,
		skip: skip || 0,
		orderBy: argsOrderBy.length ? argsOrderBy : Prisma.skip,
		where: {
			OR: argsWhereOR.length ? argsWhereOR : Prisma.skip,
			path: valueOrSkip(payload.path),
			filename: valueOrSkip(payload.filename),
			userId: valueOrSkip(payload.userId),
			createdAt: payload.createdAt
				? {
						lte: dayjs(payload.createdAt).endOf('day').toDate(),
						gte: dayjs(payload.createdAt).startOf('day').toDate(),
					}
				: Prisma.skip,
		},
	} satisfies Prisma.AssetFindManyArgs;

	if (authRole !== 'ADMIN') {
		args.where = {
			...args.where,
			userId: authId,
		};
	}

	return {
		data: await prisma.asset.findMany(args),
		total: await prisma.asset.count({
			where: args.where,
		}),
	};
};

export const handlerUploadAssetLocal = async (
	payload: AssetModelType['upload'] & {
		userId: UserModel['id'];
	},
): Promise<ResponseAssetModelType['upload']['data']> => {
	if (payload.file.type.startsWith('image/') === false) {
		throw new Error('Invalid file type: Only images are allowed.');
	}

	const fileAsset = await createFile({
		file: payload.file,
		fileId: `${slugify(payload.file.name)}-${Date.now()}`,
		path: payload.path,
		mimetype: payload.file.type,
	});

	return await prisma.asset.create({
		data: {
			filename: fileAsset.fileName,
			path: payload.path,
			userId: payload.userId,
		},
	});
};

export const handlerUploadAsset = async (
	payload: AssetModelType['upload'] & {
		userId: UserModel['id'];
	},
): Promise<ResponseAssetModelType['upload']['data']> => {
	const originalName = payload.file.name;
	const extension = originalName.split('.').pop();
	const basename = originalName.replace(/\.[^/.]+$/, '');

	const fileName = `${slugify(basename)}-${Date.now()}.${extension}`;
	const bucket = payload.path;

	const objectKey = fileName;

	const s3File = s3.file(objectKey, {
		bucket,
	});

	const fileBuffer = await payload.file.arrayBuffer();

	try {
		await s3File.write(fileBuffer, {
			type: payload.file.type,
		});

		const asset = await prisma.asset.create({
			data: {
				filename: objectKey,
				path: bucket,
				userId: payload.userId,
			},
		});

		return asset;
	} catch (error) {
		s3File.delete();

		throw error;
	}
};

export const handlerDeleteAsset = async (payload: AssetModelType['params']) => {
	const asset = await prisma.asset.delete({
		where: payload,
	});

	const file = s3.file(asset.filename, {
		bucket: asset.path,
	});

	file.delete();
};
