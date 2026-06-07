import { t, type UnwrapSchema } from 'elysia';

import { type Product } from '#generated/prisma/client';
import { AssetPlain } from '#generated/prismabox/Asset';
import { CategoryPlain } from '#generated/prismabox/Category';
import { ProductPlain, ProductRelations } from '#generated/prismabox/Product';
import { tEnumsModel, tPickModel, tQueries } from '#utils/model/general';

export type ProductRelationsType = UnwrapSchema<typeof ProductRelations>;

const SelectIncludeModel = t.Object({
	select: t.Optional(
		tEnumsModel<Product>([
			'id',
			'name',
			'slug',
			'price',
			'description',
			'rating',
			'inStock',
			'userId',
			'createdAt',
			'updatedAt',
		]),
	),
	include: t.Optional(
		tEnumsModel<ProductRelationsType>(['productThumbnails', 'productCategories']),
	),
});

export const ProductModel = {
	params: tPickModel(ProductPlain, ['id', 'slug']),
	queries: tQueries([
		SelectIncludeModel,
		t.Partial(
			tPickModel(ProductPlain, [
				'name',
				'slug',
				'price',
				'description',
				'rating',
				'inStock',
				'userId',
				'createdAt',
				'updatedAt',
			]),
		),
		t.Object({
			userEmail: t.Optional(
				t.String({
					format: 'email',
				}),
			),
			categories: t.Optional(t.Array(CategoryPlain.properties.id)),
			desc: t.Optional(
				tEnumsModel<Product>([
					'name',
					'slug',
					'price',
					'description',
					'rating',
					'inStock',
					'userId',
					'createdAt',
					'updatedAt',
				]),
			),
			asc: t.Optional(
				tEnumsModel<Product>([
					'name',
					'slug',
					'price',
					'description',
					'rating',
					'inStock',
					'userId',
					'createdAt',
					'updatedAt',
				]),
			),
		}),
	]),
	query: SelectIncludeModel,
	create: t.Composite([
		tPickModel(ProductPlain, ['name', 'slug', 'price', 'description', 'rating', 'inStock']),
		t.Partial(
			t.Object({
				thumbnails: t.Array(AssetPlain.properties.filename),
				categories: t.Array(CategoryPlain.properties.id),
			}),
		),
	]),
	update: t.Partial(
		t.Composite([
			tPickModel(ProductPlain, ['name', 'slug', 'price', 'description', 'rating', 'inStock']),
			t.Object({
				categories: t.Partial(
					t.Object({
						add: t.Optional(t.Array(CategoryPlain.properties.id)),
						remove: t.Optional(t.Array(CategoryPlain.properties.id)),
					}),
				),
				thumbnails: t.Partial(
					t.Object({
						add: t.Optional(t.Array(AssetPlain.properties.filename)),
						remove: t.Optional(t.Array(AssetPlain.properties.filename)),
					}),
				),
			}),
		]),
	),
} as const;

export type ProductModelType = {
	[k in keyof typeof ProductModel]: UnwrapSchema<(typeof ProductModel)[k]>;
};
