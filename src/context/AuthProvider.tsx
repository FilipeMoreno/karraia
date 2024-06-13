'use client'

import Loading from '@/components/loading'
import { auth } from '@/lib/firebaseService'
import { type User, onAuthStateChanged, signOut } from 'firebase/auth'
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
		const unsubscribe = onAuthStateChanged(
			auth,
			(authUserCredentials: User | null) => {
				setUserAuth(authUserCredentials)
				setLoading(false)
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
