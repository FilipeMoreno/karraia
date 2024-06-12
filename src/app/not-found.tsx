'use client'

import LogoComponent from '@/components/logo'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { FaArrowLeft } from 'react-icons/fa'

export default function NotFound() {
	const route = useRouter()
	return (
		<div className="flex h-screen flex-col items-center justify-center bg-fj font-bold text-2xl">
			<LogoComponent />

			<div className="text-9xl">404</div>
			<div>Página não encontrada</div>
			<Button
				className="my-2 w-[90%] lg:w-[270px]"
				onClick={() => route.back()}
			>
				<FaArrowLeft className="mr-2" />
				Voltar
			</Button>
		</div>
	)
}
