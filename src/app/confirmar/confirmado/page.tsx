'use client'

import LogoComponent from '@/components/logo'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { userAuthContext } from '@/context/AuthContext'
import { database } from '@/lib/firebaseService'
import { off, onValue, ref } from 'firebase/database'
import { CheckCircle2Icon } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { FaCheckCircle } from 'react-icons/fa'
import { FaPix } from 'react-icons/fa6'
import { PiSignOutBold, PiSirenFill } from 'react-icons/pi'
import { toast } from 'sonner'
import AvatarConfirmados from '../components/avatar-confirmados'

export default function Confirmado() {
	const { userAuth, logout } = userAuthContext()
	const route = useRouter()

	useEffect(() => {
		if (!userAuth) {
			route.push('/')
		} else {
			const unsubscribe = verificarPagamento()
			return () => unsubscribe()
		}
	}, [userAuth])

	const copyToClipboard = () => {
		navigator.clipboard.writeText(
			'00020126550014br.gov.bcb.pix0122karolharummy@gmail.com0207KArraia5204000053039865802BR5925KAROLINE HARUMMY ROMERO M6012CAMPO MOURAO62290525Prp9SQnmN2zFCwtxEI8jvKsbi630482D1',
		)
		toast.success('Código copiado para a área de transferência')
	}

	const verificarPagamento = () => {
		const pagamentoRef = ref(database, `confirmados/${userAuth?.uid}/pago`)

		const pagamentoListener = onValue(
			pagamentoRef,
			(snapshot) => {
				if (snapshot.exists()) {
					const pago = snapshot.val()
					if (pago) {
						toast.success('Pagamento confirmado!')
						route.push('/confirmar/pago')
					}
				}
			},
			(error) => {
				console.error('Erro ao verificar pagamento: ', error)
			},
		)

		return () => off(pagamentoRef, 'value', pagamentoListener)
	}

	return (
		<main className="flex min-h-screen flex-col items-center gap-8 bg-fj bg-no-repeat p-4">
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
							Presença confirmada, {userAuth?.displayName}!
						</p>
						<AvatarConfirmados modelo={1} />
						<p className="flex flex-row items-center">
							<PiSirenFill color="red" className="mr-2 h-5 w-5 animate-pulse" />
							Seu pagamento está pendente!
							<PiSirenFill color="red" className="ml-2 h-5 w-5 animate-pulse" />
						</p>

						<div className="flex w-full flex-col items-center justify-center gap-4 rounded-lg border-2 border-[#38beb0]">
							<p className="w-full bg-[#38beb0] text-center font-bold text-xl">
								PIX
							</p>
							<p>
								Valor: <b>R$25,00</b>
							</p>
							<div className="rounded-lg bg-zinc-100 p-4">
								<Image
									src="/pix.jpg"
									height={300}
									width={300}
									alt="QRCode PIX"
								/>
							</div>

							<Button onClick={copyToClipboard} className="mb-4 w-[60%]">
								Copiar código
								<FaPix className="mr-1 ml-1.5" color="#38beb0" />
								<b className="text-[#38beb0]">PIX</b>
							</Button>
						</div>
					</div>
				</CardContent>
				<CardFooter className="flex flex-col gap-4">
					<Button
						onClick={() => route.push('/confirmar/pago')}
						className="w-full"
					>
						<FaCheckCircle className="mr-2" />
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
