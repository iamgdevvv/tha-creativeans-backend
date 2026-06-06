import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const UserPlain = t.Object(
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
);

export const UserRelations = t.Object(
  {
    auth: __nullable__(
      t.Object(
        {
          hash: t.String(),
          salt: t.String(),
          createdAt: t.Date(),
          updatedAt: t.Date(),
          userId: t.String(),
        },
        { additionalProperties: false },
      ),
    ),
    products: t.Array(
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
      { additionalProperties: false },
    ),
    assets: t.Array(
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
      { additionalProperties: false },
    ),
  },
  { additionalProperties: false },
);

export const UserWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
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
    { $id: "User" },
  ),
);

export const UserWhereUnique = t.Recursive(
  (Self) =>
    t.Intersect(
      [
        t.Partial(
          t.Object(
            { id: t.String(), email: t.String({ format: "email" }) },
            { additionalProperties: false },
          ),
          { additionalProperties: false },
        ),
        t.Union(
          [
            t.Object({ id: t.String() }),
            t.Object({ email: t.String({ format: "email" }) }),
          ],
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
        ),
      ],
      { additionalProperties: false },
    ),
  { $id: "User" },
);

export const UserSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      name: t.Boolean(),
      email: t.Boolean(),
      role: t.Boolean(),
      isActive: t.Boolean(),
      createdAt: t.Boolean(),
      updatedAt: t.Boolean(),
      auth: t.Boolean(),
      products: t.Boolean(),
      assets: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const UserInclude = t.Partial(
  t.Object(
    {
      role: t.Boolean(),
      auth: t.Boolean(),
      products: t.Boolean(),
      assets: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const UserOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      name: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      email: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      isActive: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      createdAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      updatedAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
    },
    { additionalProperties: false },
  ),
);

export const User = t.Composite([UserPlain, UserRelations], {
  additionalProperties: false,
});
