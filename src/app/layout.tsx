import type { Metadata } from 'next'
import { Caveat, Inter, Jura } from 'next/font/google'
import '@/styles/globals.css'
import Providers from './providers'

const inter = Inter({
	subsets: ['latin'],
	display: 'swap',
	variable: '--font-inter',
})

const caveat = Caveat({
	subsets: ['latin'],
	display: 'swap',
	variable: '--font-caveat',
})

const jura = Jura({
	subsets: ['latin'],
	display: 'swap',
	variable: '--font-jura',
})

export const metadata: Metadata = {
	title: 'KArraiá',
	description: 'KArraiá - 29 de junho de 2024',
	openGraph: {
		title: 'KArraiá',
		description: 'KArraiá - 29 de junho de 2024',
		type: 'website',
		url: 'https://karraia.vercel.app',
		images: 'https://i.imgur.com/uXOHKjv.png',
		locale: 'pt-BR',
	},
	twitter: {
		card: 'summary_large_image',
		images: 'https://i.imgur.com/uXOHKjv.png',
		description: 'KArraiá - 29 de junho de 2024',
		title: 'KArraiá',
	},
	appleWebApp: {
		capable: true,
		statusBarStyle: 'default',
		title: 'KArraiá - 29 de junho de 2024',
		startupImage: ['https://i.imgur.com/uXOHKjv.png'],
	},
}

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html lang="pt-BR" className="antialiased" suppressHydrationWarning>
			<head>
				<meta charSet="utf-8" />
			</head>
			<body
				// biome-ignore lint/nursery/useSortedClasses: <explanation>
				className={`${inter.variable} ${caveat.variable} ${jura.variable}`}
			>
				<Providers>{children}</Providers>
			</body>
		</html>
	)
}
