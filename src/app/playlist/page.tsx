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
import { ScrollArea } from '@/components/ui/scroll-area'
import { userAuthContext } from '@/context/AuthContext'
import { VoteProvider } from '@/context/Votos'
import { database } from '@/lib/firebaseService'
import { rankMusicas } from '@/lib/ranking-musica'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { get, onValue, ref, remove, set, update } from 'firebase/database'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { FaExclamationTriangle, FaForward } from 'react-icons/fa'
import { FaCheck } from 'react-icons/fa6'
import { toast } from 'sonner'
import AddMusicComponent from './components/adicionar-musica'
import PlaylistLogin from './components/login'
import PlaylistMusicaComponent from './components/musica'
import PlaylistTocandoAgora from './components/tocando-agora'

export default function PlaylistIndex() {
	const { userAuth } = userAuthContext()
	const [musicas, setMusicas] = useState<any[]>([])
	const [rankedUpcomingSongs, setRankedUpcomingSongs] = useState<any[]>([])
	const [currentMusic, setCurrentMusic] = useState<any | null>(null)
	const [playlistConfig, setPlaylistConfig] = useState<any | null>(null)
	const [isAdmin, setIsAdmin] = useState(false)
	const [searchTerm, setSearchTerm] = useState('')
	const [skipVotes, setSkipVotes] = useState(0)
	const [userSkipVote, setUserSkipVote] = useState(false)
	const requiredVotes = 2

	useEffect(() => {
		const auth = getAuth()
		const unsubscribe = onAuthStateChanged(auth, (user) => {
			if (user) {
				const uid = user.uid
				const adminRef = ref(database, `admins/${uid}`)
				get(adminRef).then((snapshot) => {
					if (snapshot.exists()) {
						setIsAdmin(true)
					}
				})
			}
		})
		return () => unsubscribe()
	}, [])

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

	useEffect(() => {
		const upcomingSongs = rankMusicas(
			musicas.filter(
				(musica) => !musica.tocada && musica.id !== currentMusic?.id,
			),
		)
		setRankedUpcomingSongs(upcomingSongs)

		if (!currentMusic && upcomingSongs.length > 0) {
			const nextMusic = upcomingSongs[0]
			update(ref(database, 'current_music'), { id: nextMusic.id })
		}
	}, [musicas, currentMusic])

	const handleVoteToSkip = async () => {
		if (!userAuth || !currentMusic) return

		const userId = userAuth.uid
		const skipVoteRef = ref(database, `skip_votes/${currentMusic.id}/${userId}`)
		const skipVotesRef = ref(database, `skip_votes/${currentMusic.id}`)

		if (userSkipVote) {
			await remove(skipVoteRef)
			setUserSkipVote(false)
		} else {
			await set(skipVoteRef, { voted: true })
			setUserSkipVote(true)
		}

		onValue(skipVotesRef, (snapshot) => {
			const votes = snapshot.val() ? Object.keys(snapshot.val()).length : 0
			setSkipVotes(votes)

			if (votes >= requiredVotes) {
				handleSkipCurrentMusic()
				remove(skipVotesRef)
			}
		})
	}

	useEffect(() => {
		if (currentMusic && userAuth) {
			const userId = userAuth.uid
			const skipVoteRef = ref(
				database,
				`skip_votes/${currentMusic.id}/${userId}`,
			)
			const skipVotesRef = ref(database, `skip_votes/${currentMusic.id}`)

			onValue(skipVoteRef, (snapshot) => {
				setUserSkipVote(snapshot.exists())
			})

			onValue(skipVotesRef, (snapshot) => {
				const votes = snapshot.val() ? Object.keys(snapshot.val()).length : 0
				setSkipVotes(votes)
			})
		}
	}, [currentMusic, userAuth])

	const handleSkipCurrentMusic = async () => {
		if (rankedUpcomingSongs.length > 1) {
			const nextMusic = rankedUpcomingSongs.find(
				(musica) => musica.id !== currentMusic.id,
			)

			if (nextMusic) {
				try {
					await update(ref(database, 'current_music'), { id: nextMusic.id })
					setCurrentMusic(nextMusic)
					await atualizarMusicaComoTocada()
					toast.success('Música pulada com sucesso!', {
						description: `Tocando agora: ${nextMusic.title}`,
					})
					await remove(ref(database, `skip_votes/${currentMusic.id}`))
					setSkipVotes(0)
				} catch (error) {
					toast.error('Erro ao pular música. Tente novamente.', {
						description: `Erro: ${error}`,
					})
					console.error('Error updating current_music:', error)
				}
			} else {
				toast.info('Não há mais músicas na lista.')
			}
		} else {
			toast.info('Não há músicas suficientes para pular.')
		}
	}

	const handleForcePlayMusic = async (id: string) => {
		const music = musicas.find((musica) => musica.id === id)
		if (music) {
			await update(ref(database, 'current_music'), { id: music.id })
			setCurrentMusic(music)
			toast.success('Música tocando agora!', {
				description: `${music.title}`,
			})
		}
	}

	const handleRemoveMusic = async (id: string) => {
		const musicRef = ref(database, `musicas/${id}`)
		await remove(musicRef)
		toast.success('Música removida com sucesso!')
	}

	const handleRemoveMusicPlaylist = async (id: string) => {
		const updatedMusicas = rankedUpcomingSongs.filter(
			(musica) => musica.id !== id,
		)
		setRankedUpcomingSongs(updatedMusicas)
	}

	const atualizarMusicaComoTocada = async () => {
		if (currentMusic?.id) {
			const musicRef = ref(database, `musicas/${currentMusic.id}`)
			await update(musicRef, { tocada: true })
		}
	}

	const handleEndCurrentMusic = async () => {
		await atualizarMusicaComoTocada()

		if (rankedUpcomingSongs.length > 0) {
			let nextIndex = 0

			while (rankedUpcomingSongs[nextIndex]?.id === currentMusic?.id) {
				nextIndex++
			}
			const nextMusic = rankedUpcomingSongs[nextIndex]

			if (nextMusic) {
				await update(ref(database, 'current_music'), { id: nextMusic.id })
				setCurrentMusic(nextMusic)
			} else {
				toast.info('Não há mais músicas na playlist.')
				await update(ref(database, 'current_music'), { id: null })
				setCurrentMusic(null)
			}
		} else {
			toast.info('Não há mais músicas na playlist.')
			await update(ref(database, 'current_music'), { id: null })
			setCurrentMusic(null)
		}
	}

	const handleResetMusic = async (id: string) => {
		const musicRef = ref(database, `musicas/${id}`)
		await update(musicRef, { tocada: false, likes: 0, dislikes: 0 })

		const userId = getAuth().currentUser?.uid
		if (userId) {
			const voteRef = ref(database, `votos/${id}/${userId}`)
			await remove(voteRef)
		}

		const updatedMusicas = musicas.map((musica) =>
			musica.id === id
				? { ...musica, tocada: false, likes: 0, dislikes: 0 }
				: musica,
		)
		setMusicas(updatedMusicas)

		toast.success('Música reiniciada com sucesso!')
	}

	const handleSearchChange = (event: any) => {
		setSearchTerm(event.target.value)
	}

	const filteredMusicas = musicas.filter((musica) =>
		musica.title.toLowerCase().includes(searchTerm.toLowerCase()),
	)

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

	const orderedPlaylist = filteredMusicas.sort((a, b) => {
		if (a.tocada === b.tocada) {
			return b.addedAt - a.addedAt
		}
		return a.tocada ? 1 : -1
	})

	return (
		<VoteProvider>
			<main className="flex min-h-screen w-full flex-col items-center gap-4 p-4">
				<LogoComponent />
				<div className="flex w-full items-center justify-center md:hidden">
					<AddMusicComponent />
				</div>
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

								<div className="flex flex-col items-center justify-normal gap-2 bg-zinc-100 p-4 lg:flex-row lg:justify-between">
									<div className="flex flex-row items-center justify-center gap-2">
										<Image
											src={currentMusic.addedByPhoto}
											height={40}
											width={40}
											alt={currentMusic.addedByName}
											className="rounded-full"
										/>
										<div className="flex flex-col">
											<p className="text-xs">Adicionado por:</p>
											<p>{currentMusic.addedByName}</p>
										</div>
									</div>
									<div className="flex items-center justify-end gap-4">
										{isAdmin && (
											<Button
												variant={'destructive'}
												onClick={handleSkipCurrentMusic}
											>
												<FaForward className="mr-2" /> Pular Música
											</Button>
										)}
										<Button
											className={userSkipVote ? 'text-[#7FD7EB]' : ''}
											onClick={handleVoteToSkip}
										>
											{userSkipVote ? (
												<>
													<FaCheck className="mr-2" />
													{` Pular ${skipVotes}/${requiredVotes}`}
												</>
											) : (
												<>
													<FaForward className="mr-2" />
													{` Pular ${skipVotes}/${requiredVotes}`}
												</>
											)}
										</Button>
									</div>
								</div>
							</>
						)}
					</Card>
				)}

				<div className="flex w-full flex-col gap-4 lg:flex-row">
					<Card className="w-full lg:w-[45%]">
						<CardHeader>
							<CardTitle>Próximas músicas</CardTitle>
							<CardDescription>Próximas músicas que tocarão</CardDescription>
						</CardHeader>
						{rankedUpcomingSongs.length === 0 && (
							<CardContent>
								<p className="text-center text-zinc-500">
									Não há músicas na lista de próximas músicas.
								</p>
							</CardContent>
						)}
						<ScrollArea className="flex max-h-[500px] flex-col gap-2">
							{rankedUpcomingSongs.map((musica, index) => (
								<div key={musica.id}>
									<PlaylistMusicaComponent
										id={musica.id}
										rank={index + 1}
										musica={musica.title}
										imagem={musica.thumbnail}
										isAdmin={isAdmin}
										onRemove={() => handleRemoveMusicPlaylist(musica.id)}
										onReset={() => handleResetMusic(musica.id)}
										onForcePlay={() => handleForcePlayMusic(musica.id)}
									/>
								</div>
							))}
						</ScrollArea>
					</Card>
					<Card className="w-full lg:w-[55%]">
						<CardHeader className="flex flex-row items-center justify-between">
							<div>
								<CardTitle>Playlist</CardTitle>
								<CardDescription>Músicas na playlist</CardDescription>
							</div>
							<div className="hidden md:flex">
								<AddMusicComponent />
							</div>
						</CardHeader>

						<div className="px-6 py-3">
							<Input
								placeholder="Pesquisar..."
								value={searchTerm}
								onChange={handleSearchChange}
							/>
						</div>

						{filteredMusicas.length === 0 && (
							<CardContent>
								<p className="text-center text-zinc-500">
									Não há músicas na playlist. Adicione músicas para começar a
									tocar.
								</p>
							</CardContent>
						)}
						<ScrollArea className="flex max-h-[500px] flex-col gap-2">
							{orderedPlaylist.map((musica, index) => {
								const position =
									musicas.findIndex((m) => m.id === musica.id) + 1
								return (
									<div key={musica.id}>
										<PlaylistMusicaComponent
											id={musica.id}
											rank={position}
											musica={musica.title}
											imagem={musica.thumbnail}
											isAdmin={isAdmin}
											onRemove={() => handleRemoveMusic(musica.id)}
											tocada={musica?.tocada}
											onReset={() => handleResetMusic(musica.id)}
											onForcePlay={() => handleForcePlayMusic(musica.id)}
										/>
									</div>
								)
							})}
						</ScrollArea>
					</Card>
				</div>
			</main>
		</VoteProvider>
	)
}
