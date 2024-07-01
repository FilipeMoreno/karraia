'use client'

import FooterCard from '@/components/footer-card'
import LogoComponent from '@/components/logo'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Image from 'next/image'

export default function Home() {
	return (
		<>
			<main className="flex min-h-screen flex-col items-center gap-8 bg-fj bg-no-repeat p-4">
				<LogoComponent />
				<Card className="w-full animate-delay-300 animate-fade-down lg:w-[600px]">
					<CardHeader>
						<CardTitle className="flex items-center justify-center">
							<Image
								src="/icon.png"
								width={100}
								height={100}
								alt="Logo em ícone do KArraiá"
							/>
						</CardTitle>
					</CardHeader>
					<CardContent className="flex flex-col gap-4">
						<b className="text-center">Muito Obrigada!</b>
						<p className="text-justify">
							Muito obrigada por terem ido. Esse dia foi muito feliz e especial
							para mim! Espero que vocês também tenham gostado! Te espero no
							próximo KArraiá!
						</p>
					</CardContent>
				</Card>
				<FooterCard />
			</main>
		</>
	)
}
