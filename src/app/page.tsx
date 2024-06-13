'use client'

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
import { userAuthContext } from '@/context/AuthContext'
import { googleLogin } from '@/lib/authService'
import { database } from '@/lib/firebaseService'
import { child, get, ref } from 'firebase/database'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { FaGoogle, FaHeart } from 'react-icons/fa'
import { toast } from 'sonner'

export default function Home() {
	const { userAuth } = userAuthContext()
	const [carregando, setCarregando] = useState(true)
	const route = useRouter()

	if (userAuth) {
		get(child(ref(database), `confirmados/${userAuth?.uid}`))
			.then((snapshot) => {
				if (snapshot.exists()) {
					route.push('/confirmar/confirmado')
				} else {
					route.push('/confirmar')
				}
			})
			.catch((error) => {
				toast.error('Erro ao verificar confirmação de presença', {
					description: error,
				})
				console.error('Erro ao verificar confirmação de presença: ', error)
			})
			.finally(() => {
				setCarregando(false)
			})
	}

	const [time, setTime] = useState({
		days: 0,
		hours: 0,
		minutes: 0,
		seconds: 0,
	})

	const [isCountdownInitialized, setIsCountdownInitialized] = useState(false)

	useEffect(() => {
		const interval = setInterval(() => {
			const eventDate = new Date(Date.UTC(2024, 5, 29, 18, 0, 0))
			eventDate.setHours(eventDate.getHours())

			const now = new Date()
			const nowUTC = new Date(
				Date.UTC(
					now.getFullYear(),
					now.getMonth(),
					now.getDate(),
					now.getHours(),
					now.getMinutes(),
					now.getSeconds(),
				),
			)
			const diff = eventDate.getTime() - nowUTC.getTime()

			const days = Math.floor(diff / (1000 * 60 * 60 * 24))
			const hours = Math.floor(
				(diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
			)
			const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
			const seconds = Math.floor((diff % (1000 * 60)) / 1000)

			setTime({ days, hours, minutes, seconds })
			setIsCountdownInitialized(true)
		}, 1000)

		return () => clearInterval(interval)
	}, [])

	if (carregando) {
		if (userAuth) {
			return <Loading />
		}
	}

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
						<div className="w-full rounded-lg bg-zinc-100 p-12 text-center lg:p-4">
							{isCountdownInitialized && time.days === 0 && time.hours < -24 ? (
								<div className="mt-4 text-center">
									<h2 className="font-bold text-xl">É hoje!</h2>
								</div>
							) : isCountdownInitialized &&
								time.days === 0 &&
								time.hours === 0 &&
								time.minutes === 0 &&
								time.seconds === 0 ? (
								<div className="mt-4 text-center">
									<h2 className="font-bold text-xl">O evento começou!</h2>
								</div>
							) : (
								<>
									<p className="mb-4 font-bold font-caveat text-4xl">Faltam</p>
									<div className="flex flex-row items-center justify-center gap-2 font-bold font-jura text-xl lg:gap-4 lg:text-2xl">
										{time.days > 0 && (
											<span>
												{time.days}
												<br />
												<small>dias</small>
											</span>
										)}
										{time.hours > 0 && (
											<span>
												{time.hours}
												<br />
												<small>horas</small>
											</span>
										)}
										{time.minutes > 0 && (
											<span>
												{time.minutes}
												<br />
												<small>minutos</small>
											</span>
										)}
										<span>
											{time.seconds}
											<br />
											<small>segundos</small>
										</span>
									</div>
								</>
							)}
						</div>
						<div className="rounded-lg bg-zinc-100 p-4">
							<h1 className="mb-4 text-center font-bold font-caveat text-4xl">
								Confirme sua presença!
							</h1>
							<p className="text-center">Não vai ficar de fora, né?</p>
							<p className="text-center">
								Faça login com o Google clicando no botão abaixo para confirmar
								sua presença.
							</p>
						</div>
					</CardContent>

					<CardFooter className="flex flex-col items-center">
						<Button className="w-full" onClick={googleLogin}>
							<FaGoogle className="mr-2" /> Entrar com Google
						</Button>
						<div className="-mb-4 mt-4 flex items-center justify-center gap-1 text-xs">
							Development with <FaHeart className="text-red-500" /> by
							<Link
								href="https://github.com/filipemoreno"
								target="_blank"
								className="hover:text-[#c83e73] hover:underline"
							>
								Filipe Moreno
							</Link>
						</div>
					</CardFooter>
				</Card>
			</main>
		</>
	)
}
