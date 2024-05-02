import { defineAbilityFor, userSchema, type AppAbility } from '@saas/auth';

export function getUserPermissions(userId: string, role: string): AppAbility {
	const authUser = userSchema.parse({ id: userId, role: role });
	const ability = defineAbilityFor(authUser);

	return ability;
}
