import { jwt, type JWTPayloadSpec } from '@elysiajs/jwt';
import Elysia from 'elysia';

export const jwtHandler = new Elysia()
	.use(jwt({ name: 'jwt', secret: 'a very hidden secret' }))
	.derive({ as: 'global' }, ({ jwt }) => ({
		jwtSign: async (payload: { [key: string]: string }): Promise<string> => {
			const token = await jwt.sign(payload);
			return token;
		},
		jwtVerify: async (token: string): Promise<JWTPayloadSpec> => {
			const payload = await jwt.verify(token);
			if (!payload) throw new Error('Token is not valid');

			return payload;
		},
	}));
