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
import { database } from '@/lib/firebaseService'
import { ref, set } from 'firebase/database'
import { useRouter } from 'next/navigation'
import { PiSignOutBold } from 'react-icons/pi'
import { toast } from 'sonner'

export default function Confirmar() {
	const { userAuth, logout } = userAuthContext()
	const route = useRouter()

	if (!userAuth) {
		return route.push('/')
	}

function confirmarPresenca() {
	const userRef = ref(database, 'confirmados/' + userAuth?.uid);
	set(userRef, {
		name: userAuth?.displayName,
		email: userAuth?.email,
		presenca: true,
		confirmado_em: Date.now(),
		pago: false,
		avatar: userAuth?.photoURL,
		display_name: userAuth?.displayName,
		user_id: userAuth?.uid,
	})
	.then(() => {
		toast.success("Presença confirmada com sucesso.")
		route.push('/confirmar/confirmado')
	})
	.catch((error) => {
		toast.error('Erro ao confirmar presença', {
			description: error
		})
		console.error("Erro ao confirmar presença: ", error);
	});
}


	return (
		<>
			<main className="flex min-h-screen w-full flex-col items-center gap-8 bg-fj p-4 lg:p-24">
				<LogoComponent />
				<Card className="w-full lg:w-[600px]">
					<CardHeader>
						<CardTitle>
								<p>Olá, {userAuth?.displayName}!</p>
						</CardTitle>
					</CardHeader>
					<CardContent>
						Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolores,
						aliquid. Porro quod nemo, amet suscipit quaerat laboriosam labore in
						exercitationem, impedit ullam cupiditate voluptate doloribus sunt.
						Beatae facilis ex quo?
					</CardContent>
					<CardFooter className="gap-4 flex flex-col">
						<Button
							onClick={() => confirmarPresenca()}
							className="w-full"
						>
							Confirmar minha presença
						</Button>
						<Button onClick={logout} variant={'destructive'} className='w-full'>
							<PiSignOutBold className="mr-2" />
							Sair do app
						</Button>
					</CardFooter>
				</Card>
			</main>
		</>
	)
}
