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
				const voteRef = ref(database, `votos/${userAuth?.uid}/${id}`)

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
					await set(voteRef, type)
					setHasVoted(true)
					return currentData
				})
			} catch (error) {
				console.error('Erro ao processar voto:', error)
			}
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
				<div className="flex flex-col items-center justify-between gap-3 lg:flex-row">
					<div className="flex w-full flex-col items-center gap-3 lg:flex-row">
						<div className="flex items-center justify-center">
							<ReactPlayer
								url={url}
								className="h-auto w-full max-w-md lg:max-w-full"
								playing
								onEnded={handleEnd}
								width="100%"
								height="100%"
							/>
						</div>

						<div className="w-full">
							<h1 className="font-bold text-lg">{musica}</h1>
						</div>
					</div>
					<div className="flex w-full flex-row justify-center gap-2 lg:justify-end">
						<Button
							onClick={() => handleVote('like')}
							disabled={hasVoted}
							size="sm"
							className="flex w-full gap-1 lg:w-auto"
						>
							<FaThumbsUp />
							<p>{total_likes}</p>
						</Button>
						<Button
							onClick={() => handleVote('dislike')}
							disabled={hasVoted}
							size="sm"
							className="flex w-full gap-1 lg:w-auto"
						>
							<FaThumbsDown />
							<p>{total_deslikes}</p>
						</Button>
					</div>
				</div>
			</div>
		</CardContent>
	)
}

export default PlaylistTocandoAgora
