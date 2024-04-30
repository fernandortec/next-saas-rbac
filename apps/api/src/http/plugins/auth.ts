import { UnauthorizedError } from '@/http/_errors/unauthorized-error';
import { jwtHandler } from '@/http/plugins/jwt';
import Elysia from 'elysia';

export const auth = new Elysia()
	.use(jwtHandler)
	.derive({ as: 'global' }, ({ jwtVerify, headers }) => ({
		getCurrentUserId: async (): Promise<string> => {
			try {
				if (!headers.authorization)
					throw new UnauthorizedError('No auth token is provided');

				const { sub } = await jwtVerify(headers.authorization);
				if (!sub) throw new UnauthorizedError('User does not exists in token');

				return sub;
			} catch (error) {
				throw new UnauthorizedError('Could not authenticate user, login again');
			}
		},
	}));
