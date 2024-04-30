export function generateSlug(text: string): string {
	return (
		text
			.normalize('NFD')
			// biome-ignore lint/suspicious/noMisleadingCharacterClass: 
			.replace(/[\u0300-\u036f]/g, '')
			.toLowerCase()
			.replace(/[^\w\s]/g, '')
			.replace(/\s+/g, '-')
	);
}
