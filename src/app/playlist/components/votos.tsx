import { Button } from '@/components/ui/button'
import { userAuthContext } from '@/context/AuthContext'
import { useVoteContext } from '@/context/Votos'
import { useEffect, useState } from 'react'
import { FaArrowDown, FaArrowUp } from 'react-icons/fa6'

const VotacaoComponent = ({ musicId }) => {
	const { userAuth } = userAuthContext()
	const { votes, fetchVotes, updateVote } = useVoteContext()
	const [userVote, setUserVote] = useState(null)
	const [likes, setLikes] = useState(0)
	const [dislikes, setDislikes] = useState(0)
	const [isVoting, setIsVoting] = useState(false)

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
			setUserVote(musicVotes[userAuth?.uid] || null)
		}
	}, [votes, musicId, userAuth?.uid])

	const handleVote = async (type) => {
		if (!userAuth || isVoting) return

		setIsVoting(true)

		const previousVote = userVote

		if (type === 'like') {
			setLikes((prev) => (previousVote === 'like' ? prev - 1 : prev + 1))
			if (previousVote === 'dislike') setDislikes((prev) => prev - 1)
		} else {
			setDislikes((prev) => (previousVote === 'dislike' ? prev - 1 : prev + 1))
			if (previousVote === 'like') setLikes((prev) => prev - 1)
		}

		setUserVote(previousVote === type ? null : type)

		await updateVote(musicId, userAuth.uid, type)

		setIsVoting(false)
	}

	return (
		<div className="flex gap-2">
			<Button
				onClick={() => handleVote('like')}
				size="sm"
				className={`flex gap-1 ${userVote === 'like' ? 'text-[#7FD7EB]' : ''}`}
			>
				<FaArrowUp />
				<p>{likes}</p>
			</Button>
			<Button
				onClick={() => handleVote('dislike')}
				size="sm"
				className={`flex gap-1 ${userVote === 'dislike' ? 'text-red-400' : ''}`}
			>
				<FaArrowDown />
				<p>{dislikes}</p>
			</Button>
		</div>
	)
}

export default VotacaoComponent
