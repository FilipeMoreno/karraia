import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '@/styles/globals.css'
import Providers from './providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
	title: 'KArraiá',
	description: 'KArraiá - 29 de junho de 2024',
}

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html lang="pt-BR" className="antialiased" suppressHydrationWarning>
			<head>
				<meta charSet="urf-8" />
			</head>
			<body className={inter.className}>
				<Providers>{children}</Providers>
			</body>
		</html>
	)
}
