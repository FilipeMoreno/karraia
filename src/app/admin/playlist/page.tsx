'use client'

import AddMusicComponent from '@/app/playlist/components/adicionar-musica'
import LogoComponent from '@/components/logo'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { userAuthContext } from '@/context/AuthContext'
import { database } from '@/lib/firebaseService'
import { rankMusicas } from '@/lib/ranking-musica'
import { get, onValue, ref, remove, set, update } from 'firebase/database'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import {
	FaArrowDown,
	FaArrowUp,
	FaForward,
	FaPause,
	FaPlay,
	FaPlus,
	FaTrash,
} from 'react-icons/fa6'
import { toast } from 'sonner'

export default function PlayListAdmin() {
	const { userAuth } = userAuthContext()
	const router = useRouter()
	const [musicas, setMusicas] = useState<any[]>([])
	const [currentMusic, setCurrentMusic] = useState<any>(null)
	const [isAdmin, setIsAdmin] = useState(false)
	const [isPlaying, setIsPlaying] = useState(false)
	const [newMusicTitle, setNewMusicTitle] = useState('')

	useEffect(() => {
		if (!userAuth) {
			router.push('/login')
			return
		}

		const musicRef = ref(database, 'musicas')
		onValue(musicRef, (snapshot) => {
			const data = snapshot.val()
			let musicList = data
				? Object.keys(data).map((key) => ({ id: key, ...data[key] }))
				: []
			musicList = rankMusicas(musicList)
			setMusicas(musicList)
		})
	}, [userAuth, router])

	useEffect(() => {
		const fetchPlaylistStatus = async () => {
			const playlistConfigRef = ref(database, 'playlist_config')
			const snapshot = await get(playlistConfigRef)
			if (snapshot.exists()) {
				setIsPlaying(snapshot.val().isPlaying)
			}
		}

		const fetchCurrentMusic = async () => {
			const currentMusicRef = ref(database, 'current_music')
			onValue(currentMusicRef, (snapshot) => {
				if (snapshot.exists()) {
					const musicId = snapshot.val().id
					const music = musicas.find((musica) => musica.id === musicId)
					setCurrentMusic(music)
				}
			})
		}

		fetchPlaylistStatus()
		fetchCurrentMusic()
	}, [musicas])

	const handleRemoveMusic = async (id: string) => {
		const musicRef = ref(database, `musicas/${id}`)
		await remove(musicRef)
		toast.success('Música removida com sucesso!')
	}

	const handlePlayNow = async (id: string) => {
		const musicRef = ref(database, 'current_music')
		await update(musicRef, { id, playing: true })
		toast.success('Música tocando agora!')
	}

	const handlePromoteMusic = async (id: string) => {
		const index = musicas.findIndex((musica) => musica.id === id)
		if (index > 0) {
			const newMusicas = [...musicas]
			const [promotedMusic] = newMusicas.splice(index, 1)
			newMusicas.splice(index - 1, 0, promotedMusic)
			await set(ref(database, 'musicas'), newMusicas)
			toast.success('Música promovida com sucesso!')
		}
	}

	const handleDemoteMusic = async (id: string) => {
		const index = musicas.findIndex((musica) => musica.id === id)
		if (index < musicas.length - 1) {
			const newMusicas = [...musicas]
			const [demotedMusic] = newMusicas.splice(index, 1)
			newMusicas.splice(index + 1, 0, demotedMusic)
			await set(ref(database, 'musicas'), newMusicas)
			toast.success('Música rebaixada com sucesso!')
		}
	}

	const handleSkipMusic = async () => {
		const currentMusicRef = ref(database, 'current_music')
		const snapshot = await get(currentMusicRef)
		if (snapshot.exists()) {
			const currentMusicId = snapshot.val().id
			const index = musicas.findIndex((musica) => musica.id === currentMusicId)
			if (index >= 0 && index < musicas.length - 1) {
				const nextMusicId = musicas[index + 1].id
				await update(currentMusicRef, { id: nextMusicId, playing: true })
				toast.success('Música pulada com sucesso!')
			} else {
				toast.error('Não há mais músicas na lista para pular!')
			}
		}
	}

	const handleTogglePlaylist = async () => {
		const playlistConfigRef = ref(database, 'playlist_config')
		const snapshot = await get(playlistConfigRef)
		if (snapshot.exists()) {
			const currentIsPlaying = snapshot.val().isPlaying
			await update(playlistConfigRef, { isPlaying: !currentIsPlaying })
			setIsPlaying(!currentIsPlaying)
			toast.success(
				`Playlist ${!currentIsPlaying ? 'iniciada' : 'parada'} com sucesso!`,
			)

			const playlistIndexRef = ref(database, 'current_music')
			await set(playlistIndexRef, { isPlaying: !currentIsPlaying })
		} else {
			toast.error('Não foi possível alterar o status da playlist!')
		}
	}

	return (
		<main className="flex min-h-screen flex-col items-center gap-4 p-4">
			<LogoComponent />
			<div className="flex w-full flex-col gap-4 rounded-lg bg-white p-4 lg:w-[60%]">
				<div className="flex w-full flex-col gap-2">
					<Button onClick={handleTogglePlaylist}>
						{isPlaying ? (
							<>
								<FaPause className="mr-1" /> Pausar Playlist
							</>
						) : (
							<>
								<FaPlay className="mr-1" /> Iniciar Playlist
							</>
						)}
					</Button>
					<AddMusicComponent />
					{currentMusic && (
						<Card>
							<CardContent className="flex items-center justify-between border-gray-200 border-b p-4">
								<div className="flex flex-row items-center gap-2">
									<Image
										src={currentMusic.thumbnail}
										alt={currentMusic.title}
										width={100}
										height={50}
										className="rounded-lg"
									/>
									<span className="font-bold text-lg">
										{currentMusic.title}
									</span>
								</div>
								<Button variant="outline" onClick={handleSkipMusic}>
									<FaForward className="mr-2" /> Pular Música
								</Button>
							</CardContent>
						</Card>
					)}
					{musicas.map((musica) => (
						<Card
							key={musica.id}
							className="flex items-center justify-between border-gray-200 border-b p-4"
						>
							<span>{musica.title}</span>
							<div className="flex items-center gap-2">
								<Button
									variant="outline"
									onClick={() => handlePlayNow(musica.id)}
								>
									<FaPlay />
								</Button>
								<Button
									variant="outline"
									onClick={() => handlePromoteMusic(musica.id)}
								>
									<FaArrowUp />
								</Button>
								<Button
									variant="outline"
									onClick={() => handleDemoteMusic(musica.id)}
								>
									<FaArrowDown />
								</Button>
								<Button
									variant="outline"
									onClick={() => handleRemoveMusic(musica.id)}
								>
									<FaTrash />
								</Button>
							</div>
						</Card>
					))}
				</div>
			</div>
		</main>
	)
}
