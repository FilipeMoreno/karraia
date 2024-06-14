import { Button } from '@/components/ui/button'
import { CardContent } from '@/components/ui/card'
import { userAuthContext } from '@/context/AuthContext'

import { database } from '@/lib/firebaseService'
import { ref, remove, runTransaction, set, update } from 'firebase/database'
import { useState } from 'react'
import { FaThumbsDown, FaThumbsUp } from 'react-icons/fa'
import ReactPlayer from 'react-player'

interface PlaylistMusicaComponentProps {
	id: string
	musica: string
	imagem: string
	url: string
	total_likes: number
	total_deslikes: number
	onEnd?: () => void
}

const PlaylistTocandoAgora: React.FC<PlaylistMusicaComponentProps> = ({
	id,
	musica,
	url,
	total_likes,
	total_deslikes,
	onEnd,
}) => {
	const [hasVoted, setHasVoted] = useState<boolean>(false)
	const MAX_DISLIKES = 5
	const { userAuth } = userAuthContext()

	const handleVote = async (type: 'like' | 'dislike') => {
		if (!hasVoted) {
			try {
				const musicRef = ref(database, `musicas/${id}`)
				const voteRef = ref(database, `votos/${userAuth.uid}/${id}`)

				await runTransaction(musicRef, async (currentData) => {
					if (!currentData) {
						throw Error('Música não encontrada.')
					}

					const updates: any = {}
					if (type === 'like') {
						updates.likes = (currentData.likes || 0) + 1
					} else {
						updates.dislikes = (currentData.dislikes || 0) + 1
						if (updates.dislikes >= MAX_DISLIKES) {
							handleEnd()
						}
					}

					await update(musicRef, updates)
					await set(voteRef, type) // Registra o voto do usuário
					setHasVoted(true)
					return currentData
				})
			} catch (error) {
				console.error('Erro ao processar voto:', error)
			}
		}
	}

	const handleRemove = async () => {
		try {
			const musicRef = ref(database, `musicas/${id}`)
			await remove(musicRef)
			console.log('Música removida com sucesso!')
			if (onEnd) {
				onEnd()
			}
		} catch (error) {
			console.error('Erro ao remover música:', error)
		}
	}

	const handleEnd = () => {
		if (onEnd) {
			onEnd()
		}
	}

	return (
		<CardContent className="flex flex-col gap-2">
			<div className="flex flex-col justify-between gap-3 rounded-lg bg-zinc-100 p-4">
				<div className="flex flex-row items-center justify-between gap-3">
					<div className="flex flex-row items-center gap-3">
						<ReactPlayer
							url={url}
							width="300px"
							height="200px"
							playing
							onEnded={handleEnd}
						/>
						<div>
							<h1>{musica}</h1>
						</div>
					</div>
					<div className="flex flex-row gap-2">
						<Button
							onClick={() => handleVote('like')}
							disabled={hasVoted}
							size="sm"
							className="flex gap-1"
						>
							<FaThumbsUp />
							<p>{total_likes}</p>
						</Button>
						<Button
							onClick={() => handleVote('dislike')}
							disabled={hasVoted}
							size="sm"
							className="flex gap-1"
						>
							<FaThumbsDown />
							<p>{total_deslikes}</p>
						</Button>
						<Button onClick={handleRemove} size="sm" className="flex gap-1">
							Remover Música
						</Button>
					</div>
				</div>
			</div>
		</CardContent>
	)
}

export default PlaylistTocandoAgora
