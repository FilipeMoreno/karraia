'use client'

import FooterCard from '@/components/footer-card'
import LogoComponent from '@/components/logo'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { userAuthContext } from '@/context/AuthContext'
import { database } from '@/lib/firebaseService'
import { off, onValue, ref, remove, set } from 'firebase/database'
import { CheckCircle2Icon } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { FaCheckCircle } from 'react-icons/fa'
import { FaFaceFrown, FaPix } from 'react-icons/fa6'
import { PiSignOutBold, PiSirenFill } from 'react-icons/pi'
import { toast } from 'sonner'
import AvatarConfirmados from '../components/avatar-confirmados'

export default function Confirmado() {
	const { userAuth, logout } = userAuthContext()
	const route = useRouter()
	const [isPresencaConfirmada, setIsPresencaConfirmada] = useState(false)

	useEffect(() => {
		if (!userAuth) {
			route.push('/')
		} else {
			const unsubscribePresenca = verificarPresenca()
			const unsubscribePagamento = verificarPagamento()
			return () => {
				unsubscribePresenca()
				unsubscribePagamento()
			}
		}
	}, [userAuth])

	const copyToClipboard = () => {
		navigator.clipboard.writeText(
			'00020126550014br.gov.bcb.pix0122karolharummy@gmail.com0207KArraia5204000053039865802BR5925KAROLINE HARUMMY ROMERO M6012CAMPO MOURAO62290525Prp9SQnmN2zFCwtxEI8jvKsbi630482D1',
		)
		toast.success('Código copiado para a área de transferência')
	}

	const verificarPresenca = () => {
		const presencaRef = ref(database, `confirmados/${userAuth?.uid}/presenca`)
		const isentoRef = ref(database, `confirmados/${userAuth?.uid}/isento`)

		const presencaListener = onValue(
			presencaRef,
			(snapshot) => {
				if (snapshot.exists()) {
					const presenca = snapshot.val()
					if (presenca) {
						setIsPresencaConfirmada(true)
					} else {
						route.push('/confirmar')
					}
				} else {
					onValue(isentoRef, (isentoSnapshot) => {
						if (isentoSnapshot.exists() && isentoSnapshot.val()) {
							set(presencaRef, true)
							setIsPresencaConfirmada(true)
						} else {
							route.push('/confirmar')
						}
					})
				}
			},
			(error) => {
				console.error('Erro ao verificar presença: ', error)
				route.push('/confirmar')
			},
		)

		return () => {
			off(presencaRef, 'value', presencaListener)
			off(isentoRef, 'value', presencaListener)
		}
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
						route.push('/confirmar/pagamento')
					}
				}
			},
			(error) => {
				console.error('Erro ao verificar pagamento: ', error)
			},
		)

		const pagamentoIsentoRef = ref(
			database,
			`confirmados/${userAuth?.uid}/isento`,
		)
		const pagamentoIsentoListener = onValue(
			pagamentoIsentoRef,
			(snapshot) => {
				if (snapshot.exists()) {
					const isento = snapshot.val()
					if (isento) {
						toast.success('Pagamento confirmado!')
						route.push('/confirmar/pagamento')
					}
				}
			},
			(error) => {
				console.error('Erro ao verificar isenção: ', error)
			},
		)

		return () => off(pagamentoRef, 'value', pagamentoListener)
	}

	async function handleCancelarPresenca() {
		await remove(ref(database, `confirmados/${userAuth?.uid}`))
		toast.success('Presença cancelada!', {
			description: 'Que pena que você não poderá comparecer 😔',
		})
		route.push('/')
	}

	if (!isPresencaConfirmada) {
		return null
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
							<p className="w-full bg-[#38beb0] text-center font-bold text-white text-xl">
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
					<div className="flex w-full flex-col gap-4 rounded-lg bg-zinc-100 p-2">
						<Button
							onClick={() => route.push('/confirmar/pagamento')}
							className="w-full"
						>
							<FaCheckCircle className="mr-2" />
							Já paguei
						</Button>
						<Button
							onClick={() => handleCancelarPresenca()}
							className="w-full"
							variant={'destructive'}
						>
							<FaFaceFrown className="mr-2" />
							Cancelar presença
						</Button>
					</div>
					<Button className="w-full" onClick={logout} variant={'destructive'}>
						<PiSignOutBold className="mr-2" />
						Sair do app
					</Button>
				</CardFooter>
			</Card>
			<FooterCard />
		</main>
	)
}
