'use client'

import LogoComponent from '@/components/logo'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { useRouter } from 'next/navigation'
import { FaArrowLeft } from 'react-icons/fa'

export default function NotFound() {
	const route = useRouter()
	return (
		<main className="flex min-h-screen flex-col items-center gap-8 bg-fj bg-no-repeat p-4 font-bold text-2xl text-[#c83e73]">
			<LogoComponent />

			<Card className="flex w-full animate-delay-300 animate-fade-down flex-col items-center justify-center p-4 text-[#c3e73] lg:w-[600px]">
				<div className="text-9xl">404</div>
				<div>Página não encontrada</div>
				<Button
					className="my-2 w-[90%] lg:w-[270px]"
					onClick={() => route.back()}
				>
					<FaArrowLeft className="mr-2" />
					Voltar
				</Button>
			</Card>
		</main>
	)
}
