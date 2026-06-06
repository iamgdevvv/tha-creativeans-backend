import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const ProductThumbnailPlain = t.Object(
  { productId: t.String(), assetId: t.String() },
  { additionalProperties: false },
);

export const ProductThumbnailRelations = t.Object(
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
    asset: t.Object(
      {
        filename: t.String(),
        path: t.Union([t.Literal("products")], { additionalProperties: false }),
        createdAt: t.Date(),
        userId: t.String(),
      },
      { additionalProperties: false },
    ),
  },
  { additionalProperties: false },
);

export const ProductThumbnailWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
          productId: t.String(),
          assetId: t.String(),
        },
        { additionalProperties: false },
      ),
    { $id: "ProductThumbnail" },
  ),
);

export const ProductThumbnailWhereUnique = t.Recursive(
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
            { productId: t.String(), assetId: t.String() },
            { additionalProperties: false },
          ),
        ),
      ],
      { additionalProperties: false },
    ),
  { $id: "ProductThumbnail" },
);

export const ProductThumbnailSelect = t.Partial(
  t.Object(
    {
      product: t.Boolean(),
      productId: t.Boolean(),
      asset: t.Boolean(),
      assetId: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const ProductThumbnailInclude = t.Partial(
  t.Object(
    { product: t.Boolean(), asset: t.Boolean(), _count: t.Boolean() },
    { additionalProperties: false },
  ),
);

export const ProductThumbnailOrderBy = t.Partial(
  t.Object(
    {
      productId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      assetId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
    },
    { additionalProperties: false },
  ),
);

export const ProductThumbnail = t.Composite(
  [ProductThumbnailPlain, ProductThumbnailRelations],
  { additionalProperties: false },
);
