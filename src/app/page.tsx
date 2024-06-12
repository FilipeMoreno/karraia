'use client'

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
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { FaGoogle } from 'react-icons/fa'

export default function Home() {
	const { userAuth } = userAuthContext()
	const route = useRouter()

	if (userAuth) {
		return route.push('/confirmar')
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
			eventDate.setHours(eventDate.getHours() - 3)

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

	return (
		<>
			<main className="flex min-h-screen flex-col items-center gap-8 bg-fj p-4 lg:p-24">
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
						<div className="rounded-lg bg-zinc-100 p-4 text-center">
							{isCountdownInitialized &&
							time.days === 0 &&
							time.hours === 0 &&
							time.minutes === 0 &&
							time.seconds === 0 ? (
								<div className="mt-4 text-center">
									<h2 className="font-bold text-xl">O evento começou!</h2>
								</div>
							) : (
								<div className="flex flex-row items-center justify-center gap-6 font-bold font-jura text-2xl">
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
							)}
						</div>
						<div className="rounded-lg bg-zinc-100 p-4">
							<h1 className="text-center font-bold text-2xl">
								Confirme sua presença!
							</h1>
							<p>
								Faça login clicando no botão abaixo para confirmar sua presença.
							</p>
						</div>
					</CardContent>

					<CardFooter>
						<Button className="w-full" onClick={googleLogin}>
							<FaGoogle className="mr-2" /> Entrar com Google
						</Button>
					</CardFooter>
				</Card>
			</main>
		</>
	)
}
