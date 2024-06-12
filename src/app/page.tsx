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
import { FaGoogle } from 'react-icons/fa'

export default function Home() {
	const { userAuth, logout } = userAuthContext()
	const route = useRouter()

	if (userAuth) {
		return route.push('/confirmar')
	}

	

	return (
		<>
			<main className="flex min-h-screen flex-col items-center gap-8 bg-fj p-4 lg:p-24">
				<LogoComponent />
				<Card className="w-full lg:w-[600px]">
					<CardHeader>
						<CardTitle>Confirmar Presença</CardTitle>
					</CardHeader>
					<CardContent>
						<p>
							Faça login clicando no botão abaixo para confirmar sua presença.
						</p>
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
