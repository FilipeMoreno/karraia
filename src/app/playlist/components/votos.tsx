import { Button } from '@/components/ui/button'
import { userAuthContext } from '@/context/AuthContext'
import { useVoteContext } from '@/context/Votos'
import { useEffect, useState } from 'react'
import { FaThumbsDown, FaThumbsUp } from 'react-icons/fa'

const VotacaoComponent = ({ musicId }) => {
	const { userAuth } = userAuthContext()
	const { votes, fetchVotes, updateVote } = useVoteContext()
	const [userVote, setUserVote] = useState(null)
	const [likes, setLikes] = useState(0)
	const [dislikes, setDislikes] = useState(0)

	useEffect(() => {
		const fetchAndSetVotes = async () => {
			try {
				const votesData = await fetchVotes(musicId)
				if (votesData) {
					setLikes(votesData.likes || 0)
					setDislikes(votesData.dislikes || 0)
					setUserVote(votesData[userAuth.uid] || null)
				}
			} catch (error) {
				console.error('Erro ao buscar votos:', error)
			}
		}

		if (userAuth) {
			fetchAndSetVotes()
		}
	}, [userAuth, musicId, fetchVotes])

	useEffect(() => {
		const musicVotes = votes[musicId]
		if (musicVotes) {
			setLikes(musicVotes.likes || 0)
			setDislikes(musicVotes.dislikes || 0)
			setUserVote(musicVotes[userAuth.uid] || null)
		}
	}, [votes, musicId, userAuth.uid])

	const handleVote = async (type) => {
		if (!userAuth) return

		await updateVote(musicId, userAuth.uid, type)
	}

	return (
		<div className="flex gap-2">
			<Button
				onClick={() => handleVote('like')}
				size="sm"
				className={`flex gap-1 ${userVote === 'like' ? 'text-blue-500' : ''}`}
			>
				<FaThumbsUp />
				<p>{likes}</p>
			</Button>
			<Button
				onClick={() => handleVote('dislike')}
				size="sm"
				className={`flex gap-1 ${userVote === 'dislike' ? 'text-red-500' : ''}`}
			>
				<FaThumbsDown />
				<p>{dislikes}</p>
			</Button>
		</div>
	)
}

export default VotacaoComponent
