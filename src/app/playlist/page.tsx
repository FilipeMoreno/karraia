'use client'
import LogoComponent from '@/components/logo'
import {
	Card,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import { userAuthContext } from '@/context/AuthContext'
import { database } from '@/lib/firebaseService'
import { rankMusicas } from '@/lib/ranking-musica'
import { onValue, ref, update } from 'firebase/database'
import { useEffect, useState } from 'react'
import AddMusicComponent from './components/adicionar-musica'
import PlaylistLogin from './components/login'
import PlaylistMusicaComponent from './components/musica'
import PlaylistTocandoAgora from './components/tocando-agora'

export default function PlaylistIndex() {
	const { userAuth } = userAuthContext()
	const [musicas, setMusicas] = useState<any[]>([])
	const [currentMusic, setCurrentMusic] = useState<any | null>(null)

	useEffect(() => {
		const musicRef = ref(database, 'musicas')
		onValue(musicRef, (snapshot) => {
			const data = snapshot.val()
			const musicList = data
				? Object.keys(data).map((key) => ({ id: key, ...data[key] }))
				: []
			const rankedMusicas = rankMusicas(musicList)
			setMusicas(rankedMusicas)
			if (!currentMusic) {
				setCurrentMusic(rankedMusicas[0] || null)
			}
		})
	}, [currentMusic])

	const handleEndCurrentMusic = () => {
		if (musicas.length > 0) {
			const nextMusic = musicas[1] || null
			setCurrentMusic(nextMusic)
			if (nextMusic) {
				const musicRef = ref(database, `musicas/${nextMusic.id}`)
				update(musicRef, { playing: true })
			}
		}
	}

	if (!userAuth) {
		return <PlaylistLogin />
	}

	return (
		<>
			<main className="flex min-h-screen flex-col items-center gap-4 p-4">
				<LogoComponent />
				<Card className="w-full">
					<CardHeader>
						<CardTitle>Tocando agora</CardTitle>
					</CardHeader>
					{currentMusic && (
						<PlaylistTocandoAgora
							id={currentMusic.id}
							musica={currentMusic.title}
							url={currentMusic.url}
							imagem={currentMusic.thumbnail}
							total_likes={currentMusic.likes}
							total_deslikes={currentMusic.dislikes}
							onEnd={handleEndCurrentMusic}
						/>
					)}
				</Card>
				<div className="flex w-full flex-col justify-between gap-4 lg:flex-row">
					<Card className="w-full lg:w-[60%]">
						<CardHeader className="flex flex-row items-center justify-between">
							<div>
								<CardTitle>Playlist</CardTitle>
								<CardDescription>Músicas na playlist</CardDescription>
							</div>
							<AddMusicComponent />
						</CardHeader>
						{musicas.slice(1).map((musica) => (
							<PlaylistMusicaComponent
								key={musica.id}
								id={musica.id}
								musica={musica.title}
								imagem={musica.thumbnail}
								total_likes={musica.likes}
								total_deslikes={musica.dislikes}
								onEnd={handleEndCurrentMusic}
							/>
						))}
					</Card>
					<Card className="w-full lg:w-[40%]">
						<CardHeader>
							<CardTitle>Próximas músicas</CardTitle>
							<CardDescription>Próximas músicas que tocarão</CardDescription>
						</CardHeader>
						{musicas.slice(1).map((musica) => (
							<PlaylistMusicaComponent
								key={musica.id}
								id={musica.id}
								musica={musica.title}
								imagem={musica.thumbnail}
								total_likes={musica.likes}
								total_deslikes={musica.dislikes}
								onEnd={handleEndCurrentMusic}
							/>
						))}
					</Card>
				</div>
			</main>
		</>
	)
}
