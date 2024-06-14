const calculateRank = (
	likes: number,
	dislikes: number,
	addedAt: number,
): number => {
	const ageInHours = (Date.now() - addedAt) / 3600000
	return likes - dislikes - ageInHours
}

export const rankMusicas = (musicas: any[]): any[] => {
	return musicas.sort(
		(a, b) =>
			calculateRank(b.likes, b.dislikes, b.addedAt) -
			calculateRank(a.likes, a.dislikes, a.addedAt),
	)
}
