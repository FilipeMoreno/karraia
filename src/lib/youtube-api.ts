'use server'

export const getYouTubeVideoData = async (videoUrl: string) => {
	const videoIdMatch = videoUrl.match(
		/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/))([\w-]+)/,
	)
	const videoId = videoIdMatch ? videoIdMatch[1] : null

	if (!videoId) {
		return {
			title: '',
			thumbnail: '',
			url: '',
			error: 'ID do vídeo não encontrado na URL.',
		}
	}

	const apiKey = process.env.YOUTUBE_API_KEY

	const url = `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&part=snippet&key=${apiKey}`

	try {
		const response = await fetch(url)
		const data = await response.json()

		if (data.items.length === 0) {
			return {
				title: '',
				thumbnail: '',
				url: '',
				error: 'Vídeo não encontrado.',
			}
		}

		const { title, thumbnails } = data.items[0].snippet

		const thumbnailUrl =
			thumbnails.maxres?.url ||
			thumbnails.standard?.url ||
			thumbnails.high?.url ||
			thumbnails.medium?.url ||
			thumbnails.default.url

		return {
			title,
			thumbnail: thumbnailUrl,
			url: `https://www.youtube.com/watch?v=${videoId}`,
			error: '',
		}
	} catch (error) {
		console.error('Erro ao buscar dados do YouTube:', error)
		return {
			title: '',
			thumbnail: '',
			url: '',
			error: 'Erro ao buscar detalhes do vídeo.',
		}
	}
}
