'use client'

import { useEffect, useState } from 'react'
import ReactLoading from 'react-loading'

export default function Loading() {
	const [loadingText, setLoadingText] = useState('carregando')

	useEffect(() => {
		const interval = setInterval(() => {
			setLoadingText((prev) => {
				const dotCount = (prev.match(/\./g) || []).length
				if (dotCount < 3) {
					return `${prev}.`
				}
				return 'carregando'
			})
		}, 500)

		return () => clearInterval(interval)
	}, [])

	return (
		<div className="flex h-screen w-screen flex-col items-center justify-center bg-fj bg-no-repeat">
			<ReactLoading type="bubbles" color="black" height={100} width={100} />
			<h1 className="text-xl">{loadingText}</h1>
		</div>
	)
}
