import { createSafeActionClient } from 'next-safe-action';

export interface ActionResponse {
	success: boolean;
	message: string | null;
	errors: Record<string, string[]> | null;
}

export const actionClient = createSafeActionClient();
