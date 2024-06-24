'use client'

import Loading from '@/components/loading'
import { auth } from '@/lib/firebaseService'
import { type User, onAuthStateChanged, signOut } from 'firebase/auth'
import {
	getDatabase,
	onDisconnect,
	ref,
	remove,
	serverTimestamp,
	set,
} from 'firebase/database'
import { useRouter } from 'next/navigation'
import type React from 'react'
import { type ReactNode, useCallback, useEffect, useState } from 'react'
import { AuthContext } from './AuthContext'

interface AuthContextProviderProps {
	children: ReactNode
}

export const AuthContextProvider: React.FC<AuthContextProviderProps> = ({
	children,
}) => {
	const [userAuth, setUserAuth] = useState<User | null>(null)
	const [loading, setLoading] = useState(true)
	const route = useRouter()

	useEffect(() => {
		const database = getDatabase()
		const unsubscribe = onAuthStateChanged(
			auth,
			(authUserCredentials: User | null) => {
				setUserAuth(authUserCredentials)
				setLoading(false)

				if (authUserCredentials) {
					const uid = authUserCredentials.uid
					const userStatusRef = ref(database, `/status/${uid}`)

					const isOnlineForDatabase = {
						name: authUserCredentials.displayName,
						state: 'online',
						last_changed: serverTimestamp(),
					}

					const isOfflineForDatabase = {
						name: authUserCredentials.displayName,
						state: 'offline',
						last_changed: serverTimestamp(),
					}

					set(userStatusRef, isOnlineForDatabase)

					onDisconnect(userStatusRef).set(isOfflineForDatabase)
				}
			},
			(error) => {
				console.error('Falha ao observar o estado de autenticação:', error)
				setLoading(false)
			},
		)

		return () => unsubscribe()
	}, [])

	const logout = useCallback(async () => {
		let result = null
		let error = null
		try {
			const database = getDatabase()
			const uid = auth.currentUser?.uid
			if (uid) {
				const userStatusRef = ref(database, `/status/${uid}`)
				const onlineUsersRef = ref(database, `status/onlineUsers/${uid}`)
				set(userStatusRef, {
					state: 'offline',
					last_changed: serverTimestamp(),
				})
				remove(onlineUsersRef)
			}

			result = await signOut(auth)
			route.push('/')
		} catch (e) {
			error = e
		}

		return { result, error }
	}, [route])

	return (
		<AuthContext.Provider value={{ userAuth, logout }}>
			{loading ? <Loading /> : children}
		</AuthContext.Provider>
	)
}
