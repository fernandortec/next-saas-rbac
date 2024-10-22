import { Header } from '@/components/header';
import type { ReactNode } from 'react';

interface RootLayoutProps {
	children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps): JSX.Element {
	return (
		<div className='py-4 space-y-4'>
			<Header />
			{children}
		</div>
	);
}
