import { AuthContextProvider } from '@/context/AuthProvider'
import { GoogleAnalytics } from '@next/third-parties/google'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { ThemeProvider } from 'next-themes'
import NextTopLoader from 'nextjs-toploader'
import type { ReactNode } from 'react'
import { Toaster } from 'sonner'

export default async function Providers({ children }: { children: ReactNode }) {
	return (
		<AuthContextProvider>
			<ThemeProvider
				attribute="class"
				defaultTheme="system"
				enableSystem
				disableTransitionOnChange
			>
				{children}

				<NextTopLoader color="#af3c41" />
				<Toaster richColors closeButton />
				<SpeedInsights />
				<Analytics />
				<GoogleAnalytics gaId={`${process.env.GOOGLE_GA_ID}`} />
			</ThemeProvider>
		</AuthContextProvider>
	)
}
