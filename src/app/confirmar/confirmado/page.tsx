'use client'

import LogoComponent from '@/components/logo'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { userAuthContext } from '@/context/AuthContext'
import { database } from '@/lib/firebaseService'
import { get, ref } from 'firebase/database'
import { CheckCircle2Icon } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { FaPix } from 'react-icons/fa6'
import { PiSignOutBold, PiSirenFill } from 'react-icons/pi'
import { toast } from 'sonner'

export default function Confirmado() {
	const { userAuth, logout } = userAuthContext()
	const route = useRouter()

	if (!userAuth) {
		route.push('/')
		return null
	}

	const copyToClipboard = () => {
		navigator.clipboard.writeText(
			'00020126550014br.gov.bcb.pix0122karolharummy@gmail.com0207KArraia5204000053039865802BR5925KAROLINE HARUMMY ROMERO M6012CAMPO MOURAO62290525Prp9SQnmN2zFCwtxEI8jvKsbi630482D1',
		)
		toast.success('Código copiado para a área de transferência')
	}

	const verificarPagamento = () => {
		get(ref(database, `confirmados/${userAuth?.uid}`))
			.then((snapshot) => {
				if (snapshot.exists()) {
					const { pago } = snapshot.val()
					if (pago) {
						route.push('/confirmar/pago')
					}
				} else {
					console.log('No data available')
				}
			})
			.catch((error) => {
				console.error(error)
			})
	}

	verificarPagamento()

	return (
		<main className="flex min-h-screen flex-col items-center gap-8 bg-fj p-4">
			<LogoComponent />
			<Card className="w-full animate-delay-300 animate-fade-down lg:w-[600px]">
				<CardContent>
					<div className="mt-4 flex flex-col items-center justify-center gap-2">
						<CheckCircle2Icon
							size={60}
							color="green"
							className="animate-delay-500 animate-rotate-y"
						/>
						<p className="font-bold text-xl">
							Presença confirmada, {userAuth.displayName}!
						</p>
						<p className="flex flex-row items-center">
							Seu pagamento está pendente!
							<PiSirenFill color="red" className="ml-2 h-5 w-5 animate-pulse" />
						</p>
						<p>Valor: R$25,00</p>
						<Image src="/pix.jpg" height={300} width={300} alt="QRCode PIX" />

						<Button onClick={copyToClipboard}>
							Copiar código do <FaPix className="mr-1 ml-1.5" color="#38beb0" />
							<b className="text-[#38beb0]">PIX</b>
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
