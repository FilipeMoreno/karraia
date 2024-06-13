'use client'
import FooterCard from '@/components/footer-card'
import LogoComponent from '@/components/logo'
import { Button } from '@/components/ui/button'
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import { userAuthContext } from '@/context/AuthContext'
import { googleLogin } from '@/lib/authService'
import Image from 'next/image'
import { FaGoogle } from 'react-icons/fa6'
import PlaylistLogin from './components/login'

export default function PlaylistIndex() {
	const { userAuth } = userAuthContext()

	if (!userAuth) {
		return <PlaylistLogin />
	}

	return (
		<>
			<main className="flex min-h-screen flex-col items-center gap-8 p-4">
				<LogoComponent />
				<div className="flex w-full flex-row justify-between gap-4">
					<Card className="w-[60%]">
						<CardHeader className="flex flex-row items-center justify-between">
							<div>
								<CardTitle>Playlist</CardTitle>
								<CardDescription>Músicas na playlist</CardDescription>
							</div>
							<Button>Adicionar música</Button>
						</CardHeader>
						<CardContent className="flex flex-col gap-2">
							<div className="flex flex-row items-center gap-3 rounded-lg bg-zinc-100 p-4">
								<Image src="/fj.png" width={100} height={100} alt="Album" />
								<div>
									<h1>Nome da música</h1>
									<p>Artista</p>
								</div>
							</div>
							<div className="flex flex-row items-center gap-3 rounded-lg bg-zinc-100 p-4">
								<Image src="/fj.png" width={100} height={100} alt="Album" />
								<div>
									<h1>Nome da música</h1>
									<p>Artista</p>
								</div>
							</div>
							<div className="flex flex-row items-center gap-3 rounded-lg bg-zinc-100 p-4">
								<Image src="/fj.png" width={100} height={100} alt="Album" />
								<div>
									<h1>Nome da música</h1>
									<p>Artista</p>
								</div>
							</div>
						</CardContent>
					</Card>
					<Card className="w-[40%]">
						<CardHeader>
							<CardTitle>Próximas músicas</CardTitle>
							<CardDescription>Próximas músicas que tocaram</CardDescription>
						</CardHeader>
					</Card>
				</div>
			</main>
		</>
	)
}
