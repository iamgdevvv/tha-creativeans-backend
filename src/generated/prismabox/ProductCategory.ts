import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const ProductCategoryPlain = t.Object(
  { productId: t.String(), categoryId: t.String() },
  { additionalProperties: false },
);

export const ProductCategoryRelations = t.Object(
  {
    product: t.Object(
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
    category: t.Object(
      { id: t.String(), name: t.String() },
      { additionalProperties: false },
    ),
  },
  { additionalProperties: false },
);

export const ProductCategoryWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
          productId: t.String(),
          categoryId: t.String(),
        },
        { additionalProperties: false },
      ),
    { $id: "ProductCategory" },
  ),
);

export const ProductCategoryWhereUnique = t.Recursive(
  (Self) =>
    t.Intersect(
      [
        t.Partial(t.Object({}, { additionalProperties: false }), {
          additionalProperties: false,
        }),
        t.Union([], { additionalProperties: false }),
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
            { productId: t.String(), categoryId: t.String() },
            { additionalProperties: false },
          ),
        ),
      ],
      { additionalProperties: false },
    ),
  { $id: "ProductCategory" },
);

export const ProductCategorySelect = t.Partial(
  t.Object(
    {
      product: t.Boolean(),
      productId: t.Boolean(),
      category: t.Boolean(),
      categoryId: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const ProductCategoryInclude = t.Partial(
  t.Object(
    { product: t.Boolean(), category: t.Boolean(), _count: t.Boolean() },
    { additionalProperties: false },
  ),
);

export const ProductCategoryOrderBy = t.Partial(
  t.Object(
    {
      productId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      categoryId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
    },
    { additionalProperties: false },
  ),
);

export const ProductCategory = t.Composite(
  [ProductCategoryPlain, ProductCategoryRelations],
  { additionalProperties: false },
);
