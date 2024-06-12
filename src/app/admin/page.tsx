'use client'

import LogoComponent from '@/components/logo'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { database } from '@/lib/firebaseService'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { get, ref } from 'firebase/database'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function DashboardAdmin() {
	const route = useRouter()
	const [isAdmin, setIsAdmin] = useState(false)

	useEffect(() => {
		const auth = getAuth()
		const unsubscribe = onAuthStateChanged(auth, (user) => {
			if (user) {
				const uid = user.uid
				const adminRef = ref(database, `admins/${uid}`)
				get(adminRef).then((snapshot: { exists: () => any }) => {
					if (snapshot.exists()) {
						setIsAdmin(true)
					} else {
						setIsAdmin(false)
						route.push('/')
					}
				})
			} else {
				setIsAdmin(false)
				route.push('/')
			}
		})

		return () => unsubscribe()
	}, [])

	const goToConfirmedList = () => {
		route.push('/admin/confirmados')
	}

	const goToPlaylistManagement = () => {
		route.push('/admin/playlist')
	}

	if (!isAdmin) {
		return null
	}

	return (
		<main className="flex min-h-screen w-full flex-col items-center gap-8 bg-fj p-4">
			<LogoComponent />
			<Card>
				<CardHeader>
					<CardTitle>Dashboard Admin</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="flex flex-row items-start justify-center gap-4">
						<Button onClick={goToConfirmedList}>Lista de confirmados</Button>
						<Button onClick={goToPlaylistManagement}>
							Gerenciamento da playlist
						</Button>
					</div>
				</CardContent>
			</Card>
		</main>
	)
}
