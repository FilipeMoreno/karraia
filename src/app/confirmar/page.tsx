'use client'

import { Button } from '@/components/ui/button'
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import { userAuthContext } from '@/context/AuthContext'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { PiSignOutBold } from 'react-icons/pi'

export default function Confirmar() {
	const { userAuth, logout } = userAuthContext()
	const route = useRouter()

	if (!userAuth) {
		return route.push('/')
	}

	return (
		<>
			<main className="flex min-h-screen w-full flex-col items-center gap-8 bg-fj p-8 lg:p-24">
				<Image
					src="/logo.svg"
					width={300}
					height={300}
					alt="Logo"
					className="animate-duration-[5000ms] animate-infinite animate-wiggle"
				/>

				<Card className="w-full lg:w-[600px]">
					<CardHeader>
						<CardTitle>
							<div className="flex items-center justify-between">
								<p>Olá, {userAuth?.displayName}!</p>
								<Button onClick={logout} variant={'destructive'}>
									<PiSignOutBold className="mr-2" />
									Sair do app
								</Button>
							</div>
						</CardTitle>
					</CardHeader>
					<CardContent>
						Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolores,
						aliquid. Porro quod nemo, amet suscipit quaerat laboriosam labore in
						exercitationem, impedit ullam cupiditate voluptate doloribus sunt.
						Beatae facilis ex quo?
					</CardContent>
					<CardFooter className="gap-4">
						<Button
							onClick={() => route.push('/confirmar/confirmado')}
							className="w-full"
						>
							Confirmar minha presença
						</Button>
					</CardFooter>
				</Card>
			</main>
		</>
	)
}
