import { auth } from '@/auth/auth';
import { Header } from '@/components/header';

export default async function Page(): Promise<JSX.Element> {
	const { user } = await auth();

	return (
		<div className="py-4">
			<Header />
		</div>
	);
}
