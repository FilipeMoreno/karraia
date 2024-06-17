const calculateRank = (
	likes: number,
	dislikes: number,
	addedAt: number,
): number => {
	const ageInHours = (Date.now() - addedAt) / 3600000
	const popularity = (likes + 1) / (likes + dislikes + 2)
	const freshnessFactor = Math.exp(-ageInHours / 1)

	return popularity * 100 + freshnessFactor * 50 - ageInHours
}

export const rankMusicas = (musicas: any[]): any[] => {
	return musicas.sort(
		(a, b) =>
			calculateRank(b.likes, b.dislikes, b.addedAt) -
			calculateRank(a.likes, a.dislikes, a.addedAt),
	)
}
