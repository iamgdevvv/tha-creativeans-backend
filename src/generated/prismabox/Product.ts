import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const ProductPlain = t.Object(
  {
    id: t.String(),
    name: t.String(),
    slug: t.String(),
    price: t.Number(),
    description: t.String(),
    rating: t.Number({ min: 0, max: 5 }),
    inStock: t.Boolean(),
    createdAt: t.Date(),
    updatedAt: t.Date(),
    userId: t.String(),
  },
  { additionalProperties: false },
);

export const ProductRelations = t.Object(
  {
    user: t.Object(
      {
        id: t.String(),
        name: t.String(),
        email: t.String({ format: "email" }),
        role: t.Union(
          [t.Literal("ADMIN"), t.Literal("STAFF"), t.Literal("CUSTOMER")],
          { additionalProperties: false },
        ),
        isActive: t.Boolean(),
        createdAt: t.Date(),
        updatedAt: t.Date(),
      },
      { additionalProperties: false },
    ),
    productThumbnails: t.Array(
      t.Object(
        { productId: t.String(), assetId: t.String() },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
    productCategories: t.Array(
      t.Object(
        { productId: t.String(), categoryId: t.String() },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
  },
  { additionalProperties: false },
);

export const ProductWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
          id: t.String(),
          name: t.String(),
          slug: t.String(),
          price: t.Number(),
          description: t.String(),
          rating: t.Number({ min: 0, max: 5 }),
          inStock: t.Boolean(),
          createdAt: t.Date(),
          updatedAt: t.Date(),
          userId: t.String(),
        },
        { additionalProperties: false },
      ),
    { $id: "Product" },
  ),
);

export const ProductWhereUnique = t.Recursive(
  (Self) =>
    t.Intersect(
      [
        t.Partial(
          t.Object(
            { id: t.String(), slug: t.String() },
            { additionalProperties: false },
          ),
          { additionalProperties: false },
        ),
        t.Union(
          [t.Object({ id: t.String() }), t.Object({ slug: t.String() })],
          { additionalProperties: false },
        ),
        t.Partial(
          t.Object({
            AND: t.Union([
              Self,
              t.Array(Self, { additionalProperties: false }),
            ]),
            NOT: t.Union([
              Self,
              t.Array(Self, { additionalProperties: false }),
            ]),
            OR: t.Array(Self, { additionalProperties: false }),
          }),
          { additionalProperties: false },
        ),
        t.Partial(
          t.Object(
            {
              id: t.String(),
              name: t.String(),
              slug: t.String(),
              price: t.Number(),
              description: t.String(),
              rating: t.Number({ min: 0, max: 5 }),
              inStock: t.Boolean(),
              createdAt: t.Date(),
              updatedAt: t.Date(),
              userId: t.String(),
            },
            { additionalProperties: false },
          ),
        ),
      ],
      { additionalProperties: false },
    ),
  { $id: "Product" },
);

export const ProductSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      name: t.Boolean(),
      slug: t.Boolean(),
      price: t.Boolean(),
      description: t.Boolean(),
      rating: t.Boolean(),
      inStock: t.Boolean(),
      createdAt: t.Boolean(),
      updatedAt: t.Boolean(),
      user: t.Boolean(),
      userId: t.Boolean(),
      productThumbnails: t.Boolean(),
      productCategories: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const ProductInclude = t.Partial(
  t.Object(
    {
      user: t.Boolean(),
      productThumbnails: t.Boolean(),
      productCategories: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const ProductOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      name: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      slug: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      price: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      description: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      rating: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      inStock: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      createdAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      updatedAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      userId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
    },
    { additionalProperties: false },
  ),
);

export const Product = t.Composite([ProductPlain, ProductRelations], {
  additionalProperties: false,
});
