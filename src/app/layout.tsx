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

let description = ''

const daysLeft = new Date('2024-06-29').getTime() - new Date().getTime()
const days = Math.floor(daysLeft / (1000 * 60 * 60 * 24))

if (days < 0) {
	description = 'KArraiá - 29 de junho de 2024 | Aconteceu!'
}
if (days === 0) {
	description = 'KArraiá - 29 de junho de 2024 | É HOJE!!!'
}
if (days === 1) {
	description = 'KArraiá - 29 de junho de 2024 | É amanhã!'
} else {
	description = `KArraiá - 29 de junho de 2024 | Faltam ${days} dias!`
}

export const metadata: Metadata = {
	title: 'KArraiá',
	description: description,
	openGraph: {
		title: 'KArraiá',
		description: description,
		type: 'website',
		url: 'https://karraia.vercel.app',
		images: 'https://i.imgur.com/uXOHKjv.png',
		locale: 'pt-BR',
		siteName: 'KArraiá',
	},
	twitter: {
		card: 'summary_large_image',
		images: 'https://i.imgur.com/uXOHKjv.png',
		description: description,
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
				className={`${inter.variable} ${caveat.variable} ${jura.variable} bg-[#fbe3cb]`}
			>
				<Providers>{children}</Providers>
			</body>
		</html>
	)
}
