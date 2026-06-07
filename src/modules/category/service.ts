import { Prisma } from '#generated/prisma/client';
import { prisma } from '#libs/prisma';
import { valueOrSkip } from '#utils/lib';

import type { CategoryModelType } from './model';
import type { ResponseCategoryModelType } from './response.model';

export const handlerCategories = async (
	queryParams?: CategoryModelType['queries'],
): Promise<Pick<ResponseCategoryModelType['categories'], 'data' | 'total'>> => {
	const { limit, skip, q, desc, asc, include, select, ...payload } = queryParams || {};

	const argsWhereOR: Prisma.CategoryWhereInput[] = [];
	const argsOrderBy: Prisma.CategoryOrderByWithRelationInput[] = [];
	const argsSelect: Prisma.CategorySelect = {};
	const argsInclude: Prisma.CategoryInclude = {};

	if (q) {
		const searchFields: Prisma.CategoryOrderByRelevanceFieldEnum[] = ['name'];

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

	const args = {
		take: limit || 10,
		skip: skip || 0,
		orderBy: argsOrderBy.length ? argsOrderBy : Prisma.skip,
		where: {
			OR: argsWhereOR.length ? argsWhereOR : Prisma.skip,
			name: valueOrSkip(payload.name),
		},
		...(Object.keys(argsSelect).length ? { select: argsSelect } : {}),
		...(Object.keys(argsInclude).length ? { include: argsInclude } : {}),
	} satisfies Prisma.CategoryFindManyArgs;

	return {
		data: await prisma.category.findMany(args),
		total: await prisma.category.count({
			where: args.where,
		}),
	};
};

export const handlerCategory = async (
	recordId: CategoryModelType['params']['id'],
	queryParams?: CategoryModelType['query'],
): Promise<ResponseCategoryModelType['category']['data']> => {
	const { include, select } = queryParams || {};

	const argsSelect: Prisma.CategorySelect = {};
	const argsInclude: Prisma.CategoryInclude = {};

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

	const args = {
		where: {
			id: recordId,
		},
		...(Object.keys(argsSelect).length ? { select: argsSelect } : {}),
		...(Object.keys(argsInclude).length ? { include: argsInclude } : {}),
	} satisfies Prisma.CategoryFindUniqueOrThrowArgs;

	return await prisma.category.findUniqueOrThrow(args);
};

export const handlerCreateCategory = async (
	payload: CategoryModelType['create'],
): Promise<ResponseCategoryModelType['category']['data']> => {
	return await prisma.category.create({
		data: payload,
	});
};

export const handlerUpdateCategory = async (
	recordId: CategoryModelType['params']['id'],
	payload: CategoryModelType['update'],
) => {
	const { name } = payload;

	return await prisma.category.update({
		where: {
			id: recordId,
		},
		data: {
			name: valueOrSkip(name),
		},
	});
};

export const handlerDeleteCategory = async (recordId: CategoryModelType['params']['id']) => {
	return await prisma.category.delete({
		where: {
			id: recordId,
		},
		select: {
			id: true,
		},
	});
};
