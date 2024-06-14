import { database } from '@/lib/firebaseService'
import { getYouTubeVideoData } from '@/lib/youtube-api' // ajuste o caminho conforme necessário
import { get, ref, set } from 'firebase/database'
import { toast } from 'sonner'

interface MusicDetails {
	title: string
	thumbnail: string
	url: string
}

export const addMusic = async (url: string, user: any): Promise<boolean> => {
	try {
		const musicRef = ref(database, 'musicas')
		const snapshot = await get(musicRef)
		const musicas = snapshot.val()

		const exists =
			musicas && Object.values(musicas).some((music: any) => music.url === url)
		if (exists) {
			console.error('A música já está na playlist.')
			toast.error('Erro ao adicionar a música.', {
				description: 'A música já está na playlist.',
			})
			return false
		}

		const musicDetails = await getYouTubeVideoData(url)
		if (!musicDetails) {
			console.error('Não foi possível obter detalhes da música.')
			toast.error('Erro ao adicionar a música.', {
				description: 'Não foi possível obter detalhes da música.',
			})
			return false
		}

		const newMusicRef = ref(database, `musicas/${Date.now()}`)
		await set(newMusicRef, {
			...musicDetails,
			likes: 0,
			dislikes: 0,
			addedAt: Date.now(),
			addedById: user.uid,
			addedByName: user.displayName,
			addedByPhoto: user.photoURL,
			playing: false,
		})
		toast.success('Música adicionada com sucesso!', {
			description: `Música: ${musicDetails.title}`,
		})

		return true
	} catch (error: any) {
		console.error('Erro ao adicionar a música:', error)
		toast.error('Erro ao adicionar a música.', { description: error.message })
		return false
	}
}
