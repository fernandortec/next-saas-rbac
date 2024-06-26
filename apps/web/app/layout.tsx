import '../public/globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import type { ReactNode } from 'react';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
	title: 'Next Saas',
	description: 'By fernandortec',
};

interface RootLayoutProps {
	children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps): JSX.Element {
	return (
		<html lang="en">
			<body className={inter.className}>{children}</body>
		</html>
	);
}
