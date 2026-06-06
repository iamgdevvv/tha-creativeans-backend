import jwt, { type JWTPayloadSpec } from '@elysia/jwt';
import { t, type UnwrapSchema } from 'elysia';

const JWTPayloadModel = t.Object({
	userId: t.String({
		format: 'uuid',
	}),
});

export type JWTPayloadModelSpec = UnwrapSchema<typeof JWTPayloadModel> & JWTPayloadSpec;

export function jwtPlugin() {
	return jwt({
		name: 'jwt',
		secret: process.env.JWT_SECRET,
		schema: JWTPayloadModel,
	});
}
