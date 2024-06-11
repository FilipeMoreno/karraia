'use client'
import { userAuthContext } from '@/context/AuthContext'
import Image from 'next/image'
import { Button } from './ui/button'

export default function Menu() {
	const { userAuth, logout } = userAuthContext()

	return (
		<div className="flex items-center justify-between bg-zinc-900">
			<div className="flex items-center gap-2">
				<Image
					src={userAuth?.photoURL}
					width={40}
					height={40}
					alt={userAuth?.displayName}
					className="rounded-full"
				/>
				<h1 className="text-zinc-200">Logado como: {userAuth?.displayName}</h1>
			</div>
			<Button variant={'destructive'} onClick={logout}>
				Sair
			</Button>
		</div>
	)
}
