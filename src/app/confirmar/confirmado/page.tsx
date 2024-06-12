'use client'

import LogoComponent from '@/components/logo'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { userAuthContext } from '@/context/AuthContext'
import { CheckCircle2Icon } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { PiSignOutBold } from 'react-icons/pi'
import { toast } from 'sonner'
import {FaPix} from 'react-icons/fa6'

export default function Confirmado() {
	const { userAuth, logout } = userAuthContext()
	const route = useRouter()

	function copyToClipboard() {
		navigator.clipboard.writeText(
			'00020126550014br.gov.bcb.pix0122karolharummy@gmail.com0207KArraia5204000053039865802BR5925KAROLINE HARUMMY ROMERO M6012CAMPO MOURAO62290525Prp9SQnmN2zFCwtxEI8jvKsbi630482D1',
		)
		toast.success('Código copiado para a área de transferência')
	}

	if (!userAuth) {
		return route.push('/')
	}

	return (
		<main className="flex min-h-screen flex-col items-center gap-8 bg-fj p-4">
			<LogoComponent />
			<Card className="w-full lg:w-[600px]">
				<CardContent>
					<div className="mt-4 flex flex-col items-center justify-center gap-2">
						<CheckCircle2Icon size={60} color="green" />
						<p className="font-bold text-xl">
							Presença confirmada, {userAuth.displayName}!
						</p>
						<p>O pagamento esta pendente</p>
						<Image src="/pix.jpg" height={300} width={300} alt="QRCode PIX" />

						<Button onClick={() => copyToClipboard()}>
							
							Copiar código do <FaPix className='ml-1.5 mr-1' /> PIX
						</Button>
					</div>
				</CardContent>
				<CardFooter className="flex flex-col gap-4">
					<Button
						onClick={() => route.push('/confirmar/pago')}
						className="w-full"
					>
						Já paguei
					</Button>
					<Button className="w-full" onClick={logout} variant={'destructive'}>
						<PiSignOutBold className="mr-2" />
						Sair do app
					</Button>
				</CardFooter>
			</Card>
		</main>
	)
}
