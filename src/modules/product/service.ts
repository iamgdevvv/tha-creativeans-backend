import { Prisma, UserRole } from '#generated/prisma/client';
import type { UserModel } from '#generated/prisma/models';
import { prisma } from '#libs/prisma';
import dayjs from '#utils/dayjs';
import { linkAsset, valueOrSkip } from '#utils/lib';

import type { ProductModelType } from './model';
import type { ResponseProductModelType } from './response.model';

type QueryParamProducts = ProductModelType['queries'] & {
	authId: string;
	authRole: UserRole;
};

export const handlerProducts = async (
	queryParams?: QueryParamProducts,
): Promise<Pick<ResponseProductModelType['products'], 'data' | 'total'>> => {
	const { limit, skip, q, desc, asc, include, select, categories, authId, authRole, ...payload } =
		(queryParams || {}) as QueryParamProducts;

	const argsWhereOR: Prisma.ProductWhereInput[] = [];
	const argsOrderBy: Prisma.ProductOrderByWithRelationInput[] = [];
	const argsSelect: Prisma.ProductSelect = {};
	const argsInclude: Prisma.ProductInclude = {};

	if (q) {
		const searchFields: Prisma.ProductOrderByRelevanceFieldEnum[] = ['name', 'slug', 'description'];

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
			slug: valueOrSkip(payload.slug),
			price: valueOrSkip(payload.price),
			description: valueOrSkip(payload.description),
			inStock: valueOrSkip(payload.inStock),
			rating: valueOrSkip(payload.rating),
			userId: valueOrSkip(payload.userId),
			productCategories: categories?.length
				? {
						some: {
							categoryId: {
								in: categories,
							},
						},
					}
				: Prisma.skip,
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
	} satisfies Prisma.ProductFindManyArgs;

	if (authRole !== 'ADMIN') {
		args.where = {
			...args.where,
			userId: authId,
		};
	}

	return {
		data: await prisma.product.findMany(args),
		total: await prisma.product.count({
			where: args.where,
		}),
	};
};

export const handlerProductsPublic = async (
	queryParams?: ProductModelType['queriesPublic'],
): Promise<Pick<ResponseProductModelType['productsPublic'], 'data' | 'total'>> => {
	const { limit, skip, q, desc, asc, categories, ...payload } = queryParams || {};

	const argsWhereOR: Prisma.ProductWhereInput[] = [];
	const argsOrderBy: Prisma.ProductOrderByWithRelationInput[] = [];

	if (q) {
		const searchFields: Prisma.ProductOrderByRelevanceFieldEnum[] = ['name', 'slug', 'description'];

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
			name: valueOrSkip(payload.name),
			slug: valueOrSkip(payload.slug),
			price: valueOrSkip(payload.price),
			description: valueOrSkip(payload.description),
			inStock: valueOrSkip(payload.inStock),
			rating: valueOrSkip(payload.rating),
			productCategories: categories?.length
				? {
						some: {
							categoryId: {
								in: categories,
							},
						},
					}
				: Prisma.skip,
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
		include: {
			productThumbnails: {
				select: {
					asset: {
						select: {
							filename: true,
							path: true,
						},
					},
				},
			},
			productCategories: {
				select: {
					category: {
						select: {
							id: true,
							name: true,
						},
					},
				},
			},
		},
		omit: {
			id: true,
			userId: true,
		},
	} satisfies Prisma.ProductFindManyArgs;

	const products = await prisma.product.findMany(args);

	return {
		data: products.map((product) => {
			const { productThumbnails, productCategories, ...record } = product;

			const recordThumbnails = productThumbnails.map((thumbnail) =>
				linkAsset(thumbnail.asset.path, thumbnail.asset.filename),
			);
			const recordCategories = productCategories.map((item) => item.category);

			return {
				...record,
				thumbnails: recordThumbnails,
				categories: recordCategories,
			};
		}),
		total: await prisma.product.count({
			where: args.where,
		}),
	};
};

export const handlerProduct = async (
	recordId: ProductModelType['params']['id'],
	queryParams?: ProductModelType['query'],
): Promise<ResponseProductModelType['product']['data']> => {
	const { include, select } = queryParams || {};

	const argsSelect: Prisma.ProductSelect = {};
	const argsInclude: Prisma.ProductInclude = {};

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
	} satisfies Prisma.ProductFindUniqueOrThrowArgs;

	return await prisma.product.findUniqueOrThrow(args);
};

export const handlerProductPublic = async (
	recordSlug: ProductModelType['params']['slug'],
): Promise<ResponseProductModelType['productPublic']['data']> => {
	const { productThumbnails, productCategories, ...record } =
		await prisma.product.findUniqueOrThrow({
			where: {
				slug: recordSlug,
			},
			include: {
				productThumbnails: {
					select: {
						asset: {
							select: {
								filename: true,
								path: true,
							},
						},
					},
				},
				productCategories: {
					select: {
						category: {
							select: {
								id: true,
								name: true,
							},
						},
					},
				},
			},
			omit: {
				id: true,
				userId: true,
			},
		});

	const thumbnails = productThumbnails.map((thumbnail) =>
		linkAsset(thumbnail.asset.path, thumbnail.asset.filename),
	);
	const categories = productCategories.map((item) => item.category);

	return {
		...record,
		thumbnails,
		categories,
	};
};

export const handlerCreateProduct = async (
	payload: ProductModelType['create'] & {
		userId: UserModel['id'];
	},
): Promise<ResponseProductModelType['product']['data']> => {
	const { thumbnails, categories, ...productPayload } = payload;

	const thumbnailIds: string[] = [];
	const categoryIds: string[] = [];

	if (thumbnails?.length) {
		thumbnailIds.push(...thumbnails.flatMap((thumbnailId) => thumbnailId));
	}

	if (categories?.length) {
		categoryIds.push(...categories.flatMap((categoryId) => categoryId));
	}

	return await prisma.product.create({
		data: {
			...productPayload,
			productThumbnails: thumbnailIds.length
				? {
						createMany: {
							data: thumbnailIds.map((thumbnailId) => ({
								assetId: thumbnailId,
							})),
						},
					}
				: Prisma.skip,
			productCategories: categoryIds.length
				? {
						createMany: {
							data: categoryIds.map((categoryId) => ({
								categoryId,
							})),
						},
					}
				: Prisma.skip,
		},
	});
};

export const handlerUpdateProduct = async (
	recordId: ProductModelType['params']['id'],
	payload: ProductModelType['update'],
) => {
	const { name, slug, price, description, rating, inStock, thumbnails, categories } = payload;

	const thumbnailAddIds: string[] = [];
	const thumbnailRemoveIds: string[] = [];
	const categoryAddIds: string[] = [];
	const categoryRemoveIds: string[] = [];

	if (thumbnails?.add?.length) {
		thumbnailAddIds.push(...thumbnails.add.flatMap((thumbnailId) => thumbnailId));
	}

	if (thumbnails?.remove?.length) {
		thumbnailRemoveIds.push(...thumbnails.remove.flatMap((thumbnailId) => thumbnailId));
	}

	if (categories?.add?.length) {
		categoryAddIds.push(...categories.add.flatMap((categoryId) => categoryId));
	}

	if (categories?.remove?.length) {
		categoryRemoveIds.push(...categories.remove.flatMap((categoryId) => categoryId));
	}

	let payloadProductThumbnails: Prisma.ProductThumbnailUpdateManyWithoutProductNestedInput | null =
		null;

	let payloadProductCategories: Prisma.ProductCategoryUpdateManyWithoutProductNestedInput | null =
		null;

	if (thumbnailAddIds.length || thumbnailRemoveIds.length) {
		payloadProductThumbnails = {
			connectOrCreate: thumbnailAddIds.length
				? thumbnailAddIds.map((thumbnailId) => ({
						where: {
							productId_assetId: {
								productId: recordId,
								assetId: thumbnailId,
							},
						},
						create: {
							assetId: thumbnailId,
						},
					}))
				: Prisma.skip,
			delete: thumbnailRemoveIds.length
				? thumbnailRemoveIds.map((thumbnailId) => ({
						productId_assetId: {
							productId: recordId,
							assetId: thumbnailId,
						},
					}))
				: Prisma.skip,
		};
	}

	if (categoryAddIds.length || categoryRemoveIds.length) {
		payloadProductCategories = {
			connectOrCreate: categoryAddIds.length
				? categoryAddIds.map((categoryId) => ({
						where: {
							productId_categoryId: {
								productId: recordId,
								categoryId,
							},
						},
						create: {
							categoryId,
						},
					}))
				: Prisma.skip,
			delete: categoryRemoveIds.length
				? categoryRemoveIds.map((categoryId) => ({
						productId_categoryId: {
							productId: recordId,
							categoryId,
						},
					}))
				: Prisma.skip,
		};
	}

	return await prisma.product.update({
		where: {
			id: recordId,
		},
		data: {
			name: valueOrSkip(name),
			slug: valueOrSkip(slug),
			price: valueOrSkip(price),
			description: valueOrSkip(description),
			rating: valueOrSkip(rating),
			inStock: valueOrSkip(inStock),
			productThumbnails: payloadProductThumbnails ? payloadProductThumbnails : Prisma.skip,
			productCategories: payloadProductCategories ? payloadProductCategories : Prisma.skip,
		},
	});
};

export const handlerDeleteProduct = async (recordId: ProductModelType['params']['id']) => {
	return await prisma.product.delete({
		where: {
			id: recordId,
		},
		select: {
			id: true,
		},
	});
};
