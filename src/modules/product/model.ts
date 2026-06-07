import { t, type UnwrapSchema } from 'elysia';

import { type Product } from '#generated/prisma/client';
import { AssetPlain } from '#generated/prismabox/Asset';
import { CategoryPlain } from '#generated/prismabox/Category';
import { ProductPlain, ProductRelations } from '#generated/prismabox/Product';
import { tEnumsModel, tPickModel, tQueries } from '#utils/model/general';

export const ProductPublicPlain = t.Composite([
	t.Pick(ProductPlain, [
		'name',
		'slug',
		'price',
		'description',
		'rating',
		'inStock',
		'createdAt',
		'updatedAt',
	]),
	t.Object({
		thumbnails: t.Array(t.String()),
		categories: t.Array(CategoryPlain),
	}),
]);

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

export type ProductPublic = UnwrapSchema<typeof ProductPublicPlain>;
export type ProductRelationsType = UnwrapSchema<typeof ProductRelations>;

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
	queriesPublic: tQueries([
		t.Partial(
			tPickModel(ProductPlain, [
				'name',
				'slug',
				'price',
				'description',
				'rating',
				'inStock',
				'createdAt',
				'updatedAt',
			]),
		),
		t.Object({
			categories: t.Optional(t.Array(CategoryPlain.properties.id)),
			desc: t.Optional(
				tEnumsModel<Product>([
					'name',
					'slug',
					'price',
					'description',
					'rating',
					'inStock',
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
					'createdAt',
					'updatedAt',
				]),
			),
		}),
	]),
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
