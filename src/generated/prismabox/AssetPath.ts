import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const AssetPath = t.Union([t.Literal("products")], {
  additionalProperties: false,
});
