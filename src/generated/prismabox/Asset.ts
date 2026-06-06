import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const AssetPlain = t.Object(
  {
    filename: t.String(),
    path: t.Union([t.Literal("products")], { additionalProperties: false }),
    createdAt: t.Date(),
    userId: t.String(),
  },
  { additionalProperties: false },
);

export const AssetRelations = t.Object(
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
  },
  { additionalProperties: false },
);

export const AssetWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
          filename: t.String(),
          path: t.Union([t.Literal("products")], {
            additionalProperties: false,
          }),
          createdAt: t.Date(),
          userId: t.String(),
        },
        { additionalProperties: false },
      ),
    { $id: "Asset" },
  ),
);

export const AssetWhereUnique = t.Recursive(
  (Self) =>
    t.Intersect(
      [
        t.Partial(
          t.Object({ filename: t.String() }, { additionalProperties: false }),
          { additionalProperties: false },
        ),
        t.Union([t.Object({ filename: t.String() })], {
          additionalProperties: false,
        }),
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
              filename: t.String(),
              path: t.Union([t.Literal("products")], {
                additionalProperties: false,
              }),
              createdAt: t.Date(),
              userId: t.String(),
            },
            { additionalProperties: false },
          ),
        ),
      ],
      { additionalProperties: false },
    ),
  { $id: "Asset" },
);

export const AssetSelect = t.Partial(
  t.Object(
    {
      filename: t.Boolean(),
      path: t.Boolean(),
      createdAt: t.Boolean(),
      user: t.Boolean(),
      userId: t.Boolean(),
      productThumbnails: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const AssetInclude = t.Partial(
  t.Object(
    {
      path: t.Boolean(),
      user: t.Boolean(),
      productThumbnails: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const AssetOrderBy = t.Partial(
  t.Object(
    {
      filename: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      createdAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      userId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
    },
    { additionalProperties: false },
  ),
);

export const Asset = t.Composite([AssetPlain, AssetRelations], {
  additionalProperties: false,
});
