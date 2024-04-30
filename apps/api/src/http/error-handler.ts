import { BadRequestError } from '@/http/_errors/bad-request-error';
import { UnauthorizedError } from '@/http/_errors/unauthorized-error';
import { ValidationError, type ErrorHandler } from 'elysia';

export const errorHandler: ErrorHandler = ({ error, set }) => {
	if (error instanceof ValidationError) {
		set.status = 400;
		return {
			message: 'Validation error',
			errors: error.all,
		};
	}

	if (error instanceof BadRequestError) {
		set.status = 400;
		return { message: error.message };
	}

	if (error instanceof UnauthorizedError) {
		set.status = 400;
		return { message: error.message };
	}

	console.error(error);

	set.status = 500;
	return { message: 'Internal server error' };
};
