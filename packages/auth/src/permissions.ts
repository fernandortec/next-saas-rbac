import type { AbilityBuilder } from '@casl/ability';
import type { AppAbility } from '.';
import type { User } from './models/user';
import type { Role } from '@/roles';
import { organizationSchema } from '@/models/organization';

type PermissionsByRole = (
	user: User,
	builder: AbilityBuilder<AppAbility>
) => void;

export const permissions: { [key in Role]: PermissionsByRole } = {
	admin: (user, { can, cannot }): void => {
		can('manage', 'all');

		cannot(['transfer_ownership', 'update'], 'organization');
		can(['transfer_ownership', 'update'], 'organization', {
			ownerId: { $eq: user.id },
		});
	},
	member: (user, { can }): void => {
		can('get', 'user');
		can(['create', 'get'], 'project');
		can(['update', 'delete'], 'project', { ownerId: { $eq: user.id } });
	},
	billing: (_, { can }): void => {
		can('manage', 'billing')
	},
};
