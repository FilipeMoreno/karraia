'use client'

import { auth } from '@/lib/firebaseService'
import { type User, onAuthStateChanged, signOut } from 'firebase/auth'
import { useRouter } from 'next/navigation'
import type React from 'react'
import { type ReactNode, useEffect, useState } from 'react'
import { FaSpinner } from 'react-icons/fa'
import { AuthContext } from './AuthContext'

interface AuthContextProviderProps {
	children: ReactNode
}

export const AuthContextProvider: React.FC<AuthContextProviderProps> = ({
	children,
}) => {
	const [userAuth, setUserAuth] = useState<User | null>(null)
	const [loading, setLoading] = useState(true)
	const [loadingText, setLoadingText] = useState('carregando')

	const route = useRouter()

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(
			auth,
			(authUserCredentials: User | null) => {
				setUserAuth(authUserCredentials)
				setLoading(false)
			},
		)

		return () => unsubscribe()
	}, [])

	useEffect(() => {
		const interval = setInterval(() => {
			setLoadingText((prev) => {
				const dotCount = (prev.match(/\./g) || []).length
				if (dotCount < 3) {
					return prev + '.'
				}
				return 'carregando'
			})
		}, 500) // Atualiza a cada 500ms

		return () => clearInterval(interval)
	}, [])

	async function logout() {
		let result = null
		let error = null
		try {
			result = await signOut(auth)
			route.push('/')
		} catch (e) {
			error = e
		}

		return { result, error }
	}

	return (
		<AuthContext.Provider value={{ userAuth, logout }}>
			{loading ? (
				<div className="flex h-screen w-screen flex-col items-center justify-center">
					<FaSpinner className="animate-spin" />

					<h1>{loadingText}</h1>
				</div>
			) : (
				children
			)}
		</AuthContext.Provider>
	)
}
