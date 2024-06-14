import { Button } from '@/components/ui/button'
import { CardContent } from '@/components/ui/card'
import { database } from '@/lib/firebaseService'
import { child, get, ref, update } from 'firebase/database'
import Image from 'next/image'
import { useState } from 'react'
import { FaThumbsDown, FaThumbsUp } from 'react-icons/fa6'

interface PlaylistMusicaComponentProps {
	id: string
	musica: string
	imagem: string
	total_likes: number
	total_deslikes: number
	onEnd?: () => void
}

export default function PlaylistMusicaComponent({
	id,
	musica,
	imagem,
	total_likes,
	total_deslikes,
	onEnd,
}: PlaylistMusicaComponentProps) {
	const [hasVoted, setHasVoted] = useState<boolean>(false)

	const handleVote = async (type: 'like' | 'dislike') => {
		if (!hasVoted) {
			const musicRef = ref(database, `musicas/${id}`)
			const snapshot = await get(child(musicRef, '/'))
			const data = snapshot.val()
			const updates: any = {}
			if (type === 'like') {
				updates.likes = data.likes + 1
			} else {
				updates.dislikes = data.dislikes + 1
			}
			await update(musicRef, updates)
			setHasVoted(true)
		}
	}

	const opts = {
		height: '390',
		width: '640',
		playerVars: {
			autoplay: 1,
		},
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
						<Image src={imagem} width={100} height={100} alt="Album" />
						<div>
							<h1>{musica}</h1>
						</div>
					</div>
					<div className="flex flex-row gap-2">
						<Button
							onClick={() => handleVote('like')}
							disabled={hasVoted}
							size={'sm'}
							className="flex gap-1"
						>
							<FaThumbsUp />
							<p>{total_likes}</p>
						</Button>
						<Button
							onClick={() => handleVote('dislike')}
							disabled={hasVoted}
							size={'sm'}
							className="flex gap-1"
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
