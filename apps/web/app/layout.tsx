import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import type { ReactNode } from 'react';
import '../public/globals.css';
import { ThemeProvider } from 'next-themes';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
	title: 'Next Saas',
	description: 'By fernandortec',
};

interface RootLayoutProps {
	children: ReactNode;
}

export default function RootLayÞout({
	children,
}: RootLayoutProps): JSX.Element {
	return (
		<html lang="en">
			<body className={`${inter.className} mx-auto w-full max-w-[1200px]`}>
				<ThemeProvider
					attribute="class"
					defaultTheme="dark"
					disableTransitionOnChange
				>
					{children}
				</ThemeProvider>
			</body>
		</html>
	);
}
