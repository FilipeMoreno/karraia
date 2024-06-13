import FooterCard from '@/components/footer-card'
import LogoComponent from '@/components/logo'
import { Button } from '@/components/ui/button'
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import { googleLogin } from '@/lib/authService'
import { FaGoogle } from 'react-icons/fa6'

export default function PlaylistLogin() {
	return (
		<main className="flex min-h-screen flex-col items-center gap-8 p-4">
			<LogoComponent />
			<Card className="w-full animate-delay-300 animate-fade-down lg:w-[600px]">
				<CardHeader>
					<CardTitle>Faça Login</CardTitle>
				</CardHeader>
				<CardContent>
					Faça login com o Google clicando no botão abaixo para acessar a
					playlist.
				</CardContent>
				<CardFooter className="flex flex-col items-center">
					<Button className="w-full" onClick={googleLogin}>
						<FaGoogle className="mr-2" /> Entrar com Google
					</Button>
				</CardFooter>
			</Card>
			<FooterCard />
		</main>
	)
}
