'use client'

import LogoComponent from '@/components/logo'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
	Pagination,
	PaginationContent,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from '@/components/ui/pagination'
import { userAuthContext } from '@/context/AuthContext'
import { database } from '@/lib/firebaseService'
import { rankMusicas } from '@/lib/ranking-musica'
import { get, onValue, ref, remove, set, update } from 'firebase/database'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { FaPause, FaPlay, FaTrash } from 'react-icons/fa6'
import { toast } from 'sonner'

const ITEMS_PER_PAGE = 10

export default function PlayListAdmin() {
	const { userAuth } = userAuthContext()
	const router = useRouter()
	const [musicas, setMusicas] = useState<any[]>([])
	const [currentMusic, setCurrentMusic] = useState<any>(null)
	const [isAdmin, setIsAdmin] = useState(false)
	const [isPlaying, setIsPlaying] = useState(false)
	const [requiredVotes, setRequiredVotes] = useState(0)
	const [currentPage, setCurrentPage] = useState(1)
	const [searchQuery, setSearchQuery] = useState('')

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
			musicList.sort(
				(a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
			)
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
				setRequiredVotes(snapshot.val().requiredVotes || 0)
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

	const handleRequiredVotesChange = async (
		e: React.ChangeEvent<HTMLInputElement>,
	) => {
		const newVotes = Number.parseInt(e.target.value, 10)
		setRequiredVotes(newVotes)
		const playlistConfigRef = ref(database, 'playlist_config')
		await update(playlistConfigRef, { requiredVotes: newVotes })
		toast.success('Número de votos necessários atualizado!')
	}

	const handlePageChange = (page: number) => {
		setCurrentPage(page)
	}

	const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSearchQuery(e.target.value)
	}

	const filteredMusicas = musicas.filter((musica) =>
		musica.title.toLowerCase().includes(searchQuery.toLowerCase()),
	)

	const paginatedMusicas = filteredMusicas.slice(
		(currentPage - 1) * ITEMS_PER_PAGE,
		currentPage * ITEMS_PER_PAGE,
	)

	const totalPages = Math.ceil(filteredMusicas.length / ITEMS_PER_PAGE)

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

					<div className="flex flex-col gap-2">
						<label htmlFor="requiredVotes">
							Votos necessários para pular a música:
						</label>
						<Input
							id="requiredVotes"
							type="number"
							value={requiredVotes}
							onChange={handleRequiredVotesChange}
							className="rounded border-gray-300 p-2"
						/>
					</div>

					<div className="flex flex-col gap-2">
						<label htmlFor="searchQuery">Buscar música:</label>
						<Input
							id="searchQuery"
							type="text"
							value={searchQuery}
							onChange={handleSearchChange}
							placeholder="Digite o nome da música..."
							className="rounded border-gray-300 p-2"
						/>
					</div>

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
							</CardContent>
						</Card>
					)}
					{paginatedMusicas.map((musica) => (
						<Card
							key={musica.id}
							className="flex items-center justify-between border-gray-200 border-b p-4"
						>
							<span>{musica.title}</span>
							<div className="flex items-center gap-2">
								<Button
									variant="outline"
									onClick={() => handleRemoveMusic(musica.id)}
								>
									<FaTrash />
								</Button>
							</div>
						</Card>
					))}

					<Pagination>
						<PaginationContent>
							{currentPage > 1 && (
								<PaginationItem>
									<PaginationPrevious
										onClick={() => handlePageChange(currentPage - 1)}
									/>
								</PaginationItem>
							)}
							{Array.from({ length: totalPages }, (_, index) => (
								<PaginationItem key={index}>
									<PaginationLink
										isActive={index + 1 === currentPage}
										onClick={() => handlePageChange(index + 1)}
									>
										{index + 1}
									</PaginationLink>
								</PaginationItem>
							))}
							{currentPage < totalPages && (
								<PaginationItem>
									<PaginationNext
										onClick={() => handlePageChange(currentPage + 1)}
									/>
								</PaginationItem>
							)}
						</PaginationContent>
					</Pagination>
				</div>
			</div>
		</main>
	)
}
