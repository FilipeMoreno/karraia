import { database } from '@/lib/firebaseService'
import {
	get,
	onValue,
	ref,
	remove,
	runTransaction,
	set,
} from 'firebase/database'
import { createContext, useContext, useState } from 'react'
import { toast } from 'sonner'

const VoteContext = createContext()

export const useVoteContext = () => useContext(VoteContext)

export const VoteProvider = ({ children }) => {
	const [votes, setVotes] = useState({})

	const fetchVotes = async (musicId) => {
		let votesData = {}
		const voteRef = ref(database, `votos/${musicId}`)
		const snapshot = await get(voteRef)
		votesData = snapshot.val() || {}

		const musicRef = ref(database, `musicas/${musicId}`)
		const musicSnapshot = await get(musicRef)
		const musicData = musicSnapshot.val() || {}

		const combinedData = {
			...votesData,
			...musicData,
		}

		setVotes((prevVotes) => ({
			...prevVotes,
			[musicId]: combinedData,
		}))

		return combinedData
	}

	const updateVote = async (musicId, userId, type) => {
		const voteRef = ref(database, `votos/${musicId}/${userId}`)
		const totalLikesRef = ref(database, `musicas/${musicId}/likes`)
		const totalDislikesRef = ref(database, `musicas/${musicId}/dislikes`)

		const previousVote = votes[musicId]?.[userId]
		const isRemovingVote = previousVote === type
		const isChangingVote = previousVote && previousVote !== type

		try {
			if (isRemovingVote) {
				await remove(voteRef)
				if (type === 'like') {
					await runTransaction(
						totalLikesRef,
						(currentValue) => (currentValue || 0) - 1,
					)
				} else {
					await runTransaction(
						totalDislikesRef,
						(currentValue) => (currentValue || 0) - 1,
					)
				}
			} else {
				await set(voteRef, type)
				if (type === 'like') {
					await runTransaction(
						totalLikesRef,
						(currentValue) => (currentValue || 0) + 1,
					)
					if (isChangingVote) {
						await runTransaction(
							totalDislikesRef,
							(currentValue) => (currentValue || 0) - 1,
						)
					}
				} else {
					await runTransaction(
						totalDislikesRef,
						(currentValue) => (currentValue || 0) + 1,
					)
					if (isChangingVote) {
						await runTransaction(
							totalLikesRef,
							(currentValue) => (currentValue || 0) - 1,
						)
					}
				}
			}

			fetchVotes(musicId)
		} catch (error) {
			console.error('Erro ao atualizar votos', error)
			toast.error('Erro ao atualizar votos', {
				description: `Erro: ${error.message}`,
			})
		}
	}

	return (
		<VoteContext.Provider value={{ votes, fetchVotes, updateVote }}>
			{children}
		</VoteContext.Provider>
	)
}
