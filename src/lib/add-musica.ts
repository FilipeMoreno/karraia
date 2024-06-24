import { database } from '@/lib/firebaseService'
import { getYouTubeVideoData } from '@/lib/youtube-api'
import { get, ref, set } from 'firebase/database'
import { toast } from 'sonner'

const normalizeYouTubeUrl = (url: string | URL) => {
	const urlObj = new URL(url)
	let videoId: string | null = ''
	if (urlObj.hostname === 'youtu.be') {
		videoId = urlObj.pathname.slice(1)
	} else if (
		urlObj.hostname === 'www.youtube.com' ||
		urlObj.hostname === 'youtube.com'
	) {
		videoId = urlObj.searchParams.get('v')
	}
	return `https://www.youtube.com/watch?v=${videoId}`
}

export const addMusic = async (url: string, user: any): Promise<boolean> => {
	try {
		const musicRef = ref(database, 'musicas')
		const snapshot = await get(musicRef)
		const musicas = snapshot.val()

		const normalizedUrl = normalizeYouTubeUrl(url)

		const exists =
			musicas &&
			Object.values(musicas).some(
				(music: any) => normalizeYouTubeUrl(music.url) === normalizedUrl,
			)
		if (exists) {
			console.error('A música já está na playlist.')
			toast.error('Erro ao adicionar a música.', {
				description: 'A música já está na playlist.',
			})
			return false
		}

		const musicDetails = await getYouTubeVideoData(normalizedUrl)
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
			url: normalizedUrl,
			likes: 0,
			dislikes: 0,
			addedAt: Date.now(),
			addedById: user.uid,
			addedByName: user.displayName,
			addedByPhoto: user.photoURL,
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
