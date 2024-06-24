import { database } from '@/lib/firebaseService'
import { get, ref, remove, runTransaction, set } from 'firebase/database'
import { createContext, useContext, useState } from 'react'
import { toast } from 'sonner'

interface VoteData {
	likes: number
	dislikes: number
	[userId: string]: string | number | null
}

export interface VoteContextType {
	votes: Record<string, VoteData>
	fetchVotes: (musicId: string) => Promise<VoteData>
	updateVote: (musicId: string, userId: string, vote: string) => Promise<void>
}

const VoteContext = createContext<VoteContextType | undefined>(undefined)

export const useVoteContext = () => useContext(VoteContext)

import type { ReactNode } from 'react'

export const VoteProvider = ({ children }: { children: ReactNode }) => {
	const [votes, setVotes] = useState<Record<string, VoteData>>({})

	const fetchVotes = async (musicId: string): Promise<VoteData> => {
		const voteRef = ref(database, `votos/${musicId}`)
		const snapshot = await get(voteRef)
		const votesData = snapshot.val() || {}

		const musicRef = ref(database, `musicas/${musicId}`)
		const musicSnapshot = await get(musicRef)
		const musicData = musicSnapshot.val() || {}

		const combinedData: VoteData = {
			likes: musicData.likes || 0,
			dislikes: musicData.dislikes || 0,
			...votesData,
		}

		setVotes((prevVotes) => {
			if (JSON.stringify(prevVotes[musicId]) !== JSON.stringify(combinedData)) {
				return {
					...prevVotes,
					[musicId]: combinedData,
				}
			}

			return prevVotes
		})

		return combinedData
	}

	const updateVote = async (
		musicId: string,
		userId: string,
		type: string,
	): Promise<void> => {
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

			setVotes((prevVotes) => ({
				...prevVotes,
				[musicId]: {
					...prevVotes[musicId],
					[userId]: isRemovingVote ? null : type,
					likes:
						type === 'like'
							? (prevVotes[musicId].likes || 0) + 1
							: prevVotes[musicId].likes,
					dislikes:
						type === 'dislike'
							? (prevVotes[musicId].dislikes || 0) + 1
							: prevVotes[musicId].dislikes,
				},
			}))
		} catch (error: any) {
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
