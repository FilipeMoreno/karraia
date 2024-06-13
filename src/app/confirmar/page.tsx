'use client'

import FooterCard from '@/components/footer-card'
import Loading from '@/components/loading'
import LogoComponent from '@/components/logo'
import { Button } from '@/components/ui/button'
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { userAuthContext } from '@/context/AuthContext'
import { database } from '@/lib/firebaseService'
import { child, get, ref, set } from 'firebase/database'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { PiSignOutBold } from 'react-icons/pi'
import { toast } from 'sonner'
import AvatarConfirmados from './components/avatar-confirmados'

export default function Confirmar() {
	const { userAuth, logout } = userAuthContext()
	const [acompanhante, setAcompanhante] = useState('')
	const [verificandoPresenca, setVerificandoPresenca] = useState(true)
	const [jaConfirmado, setJaConfirmado] = useState(false)
	const route = useRouter()

	if (!userAuth) {
		return route.push('/')
	}

	if (userAuth) {
		get(child(ref(database), `confirmados/${userAuth?.uid}`))
			.then((snapshot) => {
				if (snapshot.exists()) {
					setJaConfirmado(true)
					route.push('/confirmar/confirmado')
				}
			})
			.catch((error) => {
				toast.error('Erro ao verificar confirmação de presença', {
					description: error,
				})
				console.error('Erro ao verificar confirmação de presença: ', error)
			})
			.finally(() => {
				setVerificandoPresenca(false)
			})
	}

	if (verificandoPresenca) {
		return <Loading />
	}

	function confirmarPresenca() {
		const userRef = ref(database, `confirmados/${userAuth?.uid}`)
		get(child(ref(database), `confirmados/${userAuth?.uid}`))
			.then((snapshot) => {
				if (snapshot.exists()) {
					toast.info('Sua presença já está confirmada.')
					route.push('/confirmar/confirmado')
				} else {
					set(userRef, {
						name: userAuth?.displayName,
						email: userAuth?.email,
						presenca: true,
						confirmado_em: Date.now(),
						pago: false,
						avatar: userAuth?.photoURL,
						display_name: userAuth?.displayName,
						user_id: userAuth?.uid,
						acompanhante: acompanhante || null,
					})
						.then(() => {
							toast.success('Presença confirmada com sucesso.')
							route.push('/confirmar/confirmado')
						})
						.catch((error) => {
							toast.error('Erro ao confirmar presença', {
								description: error,
							})
							console.error('Erro ao confirmar presença: ', error)
						})
				}
			})
			.catch((error) => {
				toast.error('Erro ao verificar confirmação de presença', {
					description: error,
				})
				console.error('Erro ao verificar confirmação de presença: ', error)
			})
	}

	return (
		<>
			{!jaConfirmado && (
				<main className="flex min-h-screen w-full flex-col items-center gap-8 bg-fj bg-no-repeat p-4">
					<LogoComponent />
					<Card className="w-full animate-delay-300 animate-fade-down lg:w-[600px]">
						<CardHeader>
							<CardTitle>
								<div className="flex items-center">
									<p>Olá, {userAuth?.displayName}!</p>
								</div>
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="flex flex-col gap-4">
								<div className="flex flex-col gap-2 text-justify text-lg">
									<div>
										<p>Adoraria ter sua presença no meu aniversário! 🎈</p>
										<b>Bora comemorar comigo? 🫣</b>
									</div>
									<p className="rounded-lg bg-red-100 p-2 text-center">
										É só clicar no botão abaixo e sua presença será confirmada!
									</p>
								</div>
								<div>
									<AvatarConfirmados modelo={2} />
								</div>
								<div className="flex flex-col gap-2">
									<p>
										É acompanhante? Informe o nome do(a) convidado(a) abaixo.
									</p>
									<Input
										onChange={() => {
											setAcompanhante(
												(
													document.getElementById(
														'convidado',
													) as HTMLInputElement
												).value,
											)
										}}
										type="text"
										id="convidado"
										placeholder="Nome do(a) convidado(a)"
									/>
								</div>
							</div>
						</CardContent>
						<CardFooter className="flex flex-col gap-4">
							<Button onClick={() => confirmarPresenca()} className="w-full">
								<span className="mr-2 text-lg">🎉</span>
								Quero confirmar minha presença!
							</Button>
							<Button
								onClick={logout}
								variant={'destructive'}
								className="w-full"
							>
								<PiSignOutBold className="mr-2" />
								Sair do app
							</Button>
						</CardFooter>
					</Card>
					<FooterCard />
				</main>
			)}
		</>
	)
}
