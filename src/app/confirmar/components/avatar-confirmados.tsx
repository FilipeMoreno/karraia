'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { database } from '@/lib/firebaseService'
import { get, ref } from 'firebase/database'
import { useEffect, useState } from 'react'

interface Confirmado {
	email: string
	avatar: string
	display_name: string
	presenca: boolean
}

function shuffleArray(array: Confirmado[]): Confirmado[] {
	return array
		.map((value) => ({ value, sort: Math.random() }))
		.sort((a, b) => a.sort - b.sort)
		.map(({ value }) => value)
}

export default function AvatarConfirmados({ modelo }: { modelo: number }) {
	const [confirmados, setConfirmados] = useState<Confirmado[]>([])

	useEffect(() => {
		get(ref(database, 'confirmados'))
			.then((snapshot) => {
				if (snapshot.exists()) {
					const confirmados: Confirmado[] = Object.values(
						snapshot.val(),
					).filter((value: unknown, index: number, array: unknown[]) => {
						const confirmado = value as Confirmado
						return confirmado.presenca
					}) as Confirmado[]
					setConfirmados(shuffleArray(confirmados))
				}
			})
			.catch((error) => {
				console.error(error)
			})
	}, [])

	const numToShow = 5
	const extraCount =
		confirmados.length > numToShow ? confirmados.length - numToShow + 1 : 0
	const displayedConfirmados = confirmados.slice(
		0,
		numToShow - (extraCount > 0 ? 1 : 0),
	)

	return (
		<>
			{confirmados.length > 0 && (
				<div className="flex w-full flex-col items-center justify-center gap-2 rounded-lg bg-zinc-100 p-4 lg:flex-row">
					{modelo === 1 ? (
						<p>Você e mais </p>
					) : modelo === 2 ? null : (
						<p>Você e mais</p>
					)}
					<div className="-space-x-3 flex *:ring *:ring-white">
						{displayedConfirmados.map((confirmado) => (
							<Avatar key={confirmado.email}>
								<AvatarImage src={confirmado.avatar} />
								<AvatarFallback>
									{confirmado.display_name.charAt(0)}
								</AvatarFallback>
							</Avatar>
						))}
						{extraCount > 0 && (
							<Avatar key="extra">
								{modelo === 1 ? (
									<AvatarFallback>+{extraCount - 1}</AvatarFallback>
								) : modelo === 2 ? (
									<AvatarFallback>+{extraCount}</AvatarFallback>
								) : (
									<AvatarFallback>+{extraCount - 1}</AvatarFallback>
								)}
							</Avatar>
						)}
					</div>
					{modelo === 1 ? (
						<p>já confirmam presença!</p>
					) : modelo === 2 ? (
						<p>já confirmaram presença! Vai ficar de fora?</p>
					) : (
						<p>estão confirmados!</p>
					)}
				</div>
			)}
		</>
	)
}
