'use client'

import LogoComponent from '@/components/logo'
import { Button } from '@/components/ui/button'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { userAuthContext } from '@/context/AuthContext'
import { VoteProvider } from '@/context/Votos'
import { database } from '@/lib/firebaseService'
import { rankMusicas } from '@/lib/ranking-musica'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { get, onValue, ref, remove, update } from 'firebase/database'
import { useEffect, useState } from 'react'
import { FaExclamationTriangle, FaForward } from 'react-icons/fa'
import { toast } from 'sonner'
import AddMusicComponent from './components/adicionar-musica'
import PlaylistLogin from './components/login'
import PlaylistMusicaComponent from './components/musica'
import musica from './components/musica'
import PlaylistTocandoAgora from './components/tocando-agora'

export default function PlaylistIndex() {
	const { userAuth } = userAuthContext()
	const [musicas, setMusicas] = useState<any[]>([])
	const [currentMusic, setCurrentMusic] = useState<any | null>(null)
	const [playlistConfig, setPlaylistConfig] = useState<any | null>(null)
	const [isAdmin, setIsAdmin] = useState(false)

	useEffect(() => {
		const auth = getAuth()
		const unsubscribe = onAuthStateChanged(auth, (user) => {
			if (user) {
				const uid = user.uid
				const adminRef = ref(database, `admins/${uid}`)
				get(adminRef).then((snapshot: { exists: () => any }) => {
					if (snapshot.exists()) {
						setIsAdmin(true)
					}
				})
			}
		})
	})

	useEffect(() => {
		const musicRef = ref(database, 'musicas')
		onValue(musicRef, (snapshot) => {
			const data = snapshot.val()
			const musicList = data
				? Object.keys(data).map((key) => ({ id: key, ...data[key] }))
				: []
			setMusicas(musicList)
		})

		const configRef = ref(database, 'playlist_config')
		onValue(configRef, (snapshot) => {
			setPlaylistConfig(snapshot.val())
		})
	}, [])

	useEffect(() => {
		const currentMusicRef = ref(database, 'current_music')
		onValue(currentMusicRef, (snapshot) => {
			const musicId = snapshot.exists() ? snapshot.val().id : null
			const music = musicId
				? musicas.find((musica) => musica.id === musicId)
				: null
			setCurrentMusic(music)
		})
	}, [musicas])

	const handleSkipCurrentMusic = () => {
		if (rankedUpcomingSongs.length > 0) {
			const nextMusic = rankedUpcomingSongs[0]
			setCurrentMusic(nextMusic)
			setMusicas((prevMusicas) =>
				prevMusicas.filter((musica) => musica.id !== nextMusic.id),
			)
		}
	}

	const handleRemoveMusic = async (id: string) => {
		const musicRef = ref(database, `musicas/${id}`)
		await remove(musicRef)
		toast.success('Música removida com sucesso!')
	}

	const atualizarMusicaComoTocada = () => {
		if (currentMusic?.id) {
			const musicRef = ref(database, `musicas/${currentMusic.id}`)
			update(musicRef, { tocada: true })
				.then(() => {
					console.log('Música atualizada como tocada.')
				})
				.catch((error) => {
					console.error('Erro ao atualizar a música: ', error)
				})
		}
	}

	const handleEndCurrentMusic = () => {
		atualizarMusicaComoTocada()

		if (rankedUpcomingSongs.length > 0) {
			const nextMusic = rankedUpcomingSongs[0]
			setCurrentMusic(nextMusic)
			setMusicas((prevMusicas) => {
				const nextMusicIndex = prevMusicas.findIndex(
					(musica) => musica.id === nextMusic.id,
				)
				if (nextMusicIndex >= 0) {
					return [
						...prevMusicas.slice(0, nextMusicIndex),
						...prevMusicas.slice(nextMusicIndex + 1),
					]
				}
				return prevMusicas
			})
		} else {
			toast.info('Não há mais músicas na playlist.')
		}
	}

	if (!userAuth) {
		return <PlaylistLogin />
	}

	if (!playlistConfig || !playlistConfig.isPlaying) {
		return (
			<main className="flex min-h-screen flex-col items-center gap-8 p-4">
				<LogoComponent />
				<div className="flex w-[60%] flex-col items-center justify-center gap-2 rounded-lg bg-white p-4">
					<FaExclamationTriangle className="animate-pulse text-6xl text-red-500" />
					<p className="text-xl">A playlist está pausada.</p>
				</div>
			</main>
		)
	}

	const orderedPlaylist = musicas.sort((a, b) => b.addedAt - a.addedAt)
	const rankedUpcomingSongs = rankMusicas(musicas.slice())

	return (
		<VoteProvider>
			<main className="flex min-h-screen flex-col items-center gap-4 p-4">
				<LogoComponent />
				{currentMusic && (
					<Card className="w-full">
						<CardHeader>
							<CardTitle>Tocando agora</CardTitle>
						</CardHeader>
						{currentMusic && (
							<>
								<PlaylistTocandoAgora
									id={currentMusic.id}
									musica={currentMusic.title}
									url={currentMusic.url}
									imagem={currentMusic.thumbnail}
									onEnd={handleEndCurrentMusic}
									isAdmin={isAdmin}
									onRemove={() => handleRemoveMusic(currentMusic.id)}
								/>
								{currentMusic && isAdmin && (
									<div className="flex items-center justify-end bg-zinc-100 p-4">
										<Button onClick={handleSkipCurrentMusic}>
											<FaForward className="mr-2" /> Pular Música
										</Button>
									</div>
								)}
							</>
						)}
					</Card>
				)}
				<div className="flex w-full flex-col justify-between gap-4 lg:flex-row">
					<Card className="w-full lg:w-[60%]">
						<CardHeader className="flex flex-row items-center justify-between">
							<div>
								<CardTitle>Playlist</CardTitle>
								<CardDescription>Músicas na playlist</CardDescription>
							</div>
							<AddMusicComponent />
						</CardHeader>
						<div className="px-6 py-3">
							<Input placeholder="Pesquisar..." />
						</div>
						{musicas.length === 0 && (
							<CardContent>
								<p className="text-center text-zinc-500">
									Não há músicas na playlist. Adicione músicas para começar a
									tocar.
								</p>
							</CardContent>
						)}
						{orderedPlaylist.map((musica, index) => {
							return (
								<div key={musica.id}>
									<PlaylistMusicaComponent
										id={musica.id}
										rank={index + 1}
										musica={musica.title}
										imagem={musica.thumbnail}
										isAdmin={isAdmin}
										onRemove={() => handleRemoveMusic(musica.id)}
										tocada={musica?.tocada}
									/>
								</div>
							)
						})}
					</Card>
					<Card className="w-full lg:w-[40%]">
						<CardHeader>
							<CardTitle>Próximas músicas</CardTitle>
							<CardDescription>Próximas músicas que tocarão</CardDescription>
						</CardHeader>
						{musicas.length === 0 && (
							<CardContent>
								<p className="text-center text-zinc-500">
									Não há músicas na playlist.
								</p>
							</CardContent>
						)}
						{rankedUpcomingSongs.map((musica, index) => (
							<div key={musica.id}>
								<PlaylistMusicaComponent
									id={musica.id}
									rank={index + 1}
									musica={musica.title}
									imagem={musica.thumbnail}
									isAdmin={isAdmin}
									onRemove={() => handleRemoveMusic(musica.id)}
								/>
							</div>
						))}
					</Card>
				</div>
			</main>
		</VoteProvider>
	)
}
