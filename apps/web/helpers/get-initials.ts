export function getInitials(name: string | null): string {
	const nameAndSurname = name?.split(' ') ?? ['A', 'B'];
	return `${nameAndSurname[0].charAt(0)}${nameAndSurname[1].charAt(0)}`;
}
