import { Button } from '@/components/ui/button'
import { CardContent } from '@/components/ui/card'
import { AuthContext } from '@/context/AuthContext'
import { database } from '@/lib/firebaseService'
import { get, ref, runTransaction, set } from 'firebase/database'
import Image from 'next/image'
import { useState } from 'react'
import { FaThumbsDown, FaThumbsUp } from 'react-icons/fa'

interface PlaylistMusicaComponentProps {
	id: string
	musica: string
	imagem: string
	total_likes: number
	total_deslikes: number
	onEnd?: () => void
}

const PlaylistMusicaComponent: React.FC<PlaylistMusicaComponentProps> = ({
	id,
	musica,
	imagem,
	total_likes,
	total_deslikes,
	onEnd,
}) => {
	const [user, setUser] = useState(null)
	const [hasVoted, setHasVoted] = useState(false)
	const [likes, setLikes] = useState(total_likes)
	const [dislikes, setDislikes] = useState(total_deslikes)

	const userAuth = AuthContext()

	const checkIfUserHasVoted = async (uid: string) => {
		const voteRef = ref(database, `votes/${id}/${uid}`)
		const snapshot = await get(voteRef)
		if (snapshot.exists()) {
			setHasVoted(true)
		}
	}

	const handleVote = async (type: 'like' | 'dislike') => {
		if (!userAuth) return

		const voteRef = ref(database, `votes/${id}/${userAuth?.uid}`)
		const totalLikesRef = ref(database, `musicas/${id}/like`)
		const totalDislikesRef = ref(database, `musicas/${id}/deslike`)

		await set(voteRef, type)
		setHasVoted(true)

		if (type === 'like') {
			await runTransaction(
				totalLikesRef,
				(currentLikes) => (currentLikes || 0) + 1,
			)
			setLikes((prevLikes) => prevLikes + 1)
		} else {
			await runTransaction(
				totalDislikesRef,
				(currentDislikes) => (currentDislikes || 0) + 1,
			)
			setDislikes((prevDislikes) => prevDislikes + 1)
		}
	}

	return (
		<CardContent className="flex flex-col gap-2">
			<div className="flex flex-row items-center justify-between gap-3 rounded-lg bg-zinc-100 p-4">
				<div className="flex flex-row items-center gap-3">
					<Image
						src={imagem}
						alt={musica}
						width={64}
						height={64}
						className="rounded-lg"
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
						<p>{likes}</p>
					</Button>
					<Button
						onClick={() => handleVote('dislike')}
						disabled={hasVoted}
						size="sm"
						className="flex gap-1"
					>
						<FaThumbsDown />
						<p>{dislikes}</p>
					</Button>
				</div>
			</div>
		</CardContent>
	)
}

export default PlaylistMusicaComponent
