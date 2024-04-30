import { UnauthorizedError } from '@/http/_errors/unauthorized-error';
import { jwtHandler } from '@/http/plugins/jwt';
import Elysia from 'elysia';

export const auth = new Elysia()
	.use(jwtHandler)
	.derive({ as: 'global' }, ({ jwtVerify, headers }) => ({
		getCurrentUserId: async () => {
			try {
				if (!headers.authorization)
					throw new UnauthorizedError('No auth token is provided');

				const { sub } = await jwtVerify(headers.authorization);
				return sub;
			} catch {
				throw new UnauthorizedError('Invalid auth');
			}
		},
	}));
