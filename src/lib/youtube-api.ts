'use server'

export const getYouTubeVideoData = async (videoUrl: string) => {
	const videoIdMatch = videoUrl.match(
		/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/))([\w-]+)/,
	)
	const videoId = videoIdMatch ? videoIdMatch[1] : null
	if (!videoId) {
		console.error('Invalid YouTube URL')
		return null
	}

	const apiKey = process.env.YOUTUBE_API_KEY
	console.log('apiKey', apiKey)
	const url = `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&part=snippet&key=${apiKey}`

	try {
		const response = await fetch(url)
		const data = await response.json()
		if (data.items.length === 0) {
			console.error('No data found for this video ID')
			return null
		}
		const { title, thumbnails } = data.items[0].snippet
		return {
			title,
			thumbnail: thumbnails.default.url,
		}
	} catch (error) {
		console.error('Error fetching YouTube data', error)
		return null
	}
}
